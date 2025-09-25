import { promises as fs } from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

export interface Migration {
    id: number;
    name: string;
    filename: string;
    sql?: string;
    appliedAt?: Date;
}

export interface MigrationResult {
    success: boolean;
    migration: Migration;
    error?: Error;
}

export class MigrationService {
    private db: sqlite3.Database;
    private migrationsPath: string;

    constructor(database: sqlite3.Database, migrationsPath: string = './migrations') {
        this.db = database;
        this.migrationsPath = migrationsPath;
    }

    /**
     * Initialize the migrations system by creating the migrations table
     */
    async initialize(): Promise<void> {
        const runAsync = (sql: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                this.db.run(sql, function (err) {
                    if (err) reject(err);
                    else resolve();
                });
            });
        };

        try {
            await runAsync(`
                CREATE TABLE IF NOT EXISTS schema_migrations (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL UNIQUE,
                    filename TEXT NOT NULL,
                    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('Migration system initialized');
        } catch (error) {
            console.error('Failed to initialize migration system:', error);
            throw error;
        }
    }

    /**
     * Get all migration files from the migrations directory
     */
    async getMigrationFiles(): Promise<Migration[]> {
        try {
            const files = await fs.readdir(this.migrationsPath);
            const migrationFiles = files
                .filter(file => file.endsWith('.sql'))
                .sort(); // Ensure migrations are applied in order

            const migrations: Migration[] = [];

            for (const filename of migrationFiles) {
                const filePath = path.join(this.migrationsPath, filename);
                const sql = await fs.readFile(filePath, 'utf-8');

                // Extract migration number from filename (e.g., "01-added-books-table.sql" -> 1)
                const match = filename.match(/^(\d+)-(.+)\.sql$/);
                if (match) {
                    const id = parseInt(match[1], 10);
                    const name = match[2].replace(/-/g, ' ');

                    migrations.push({
                        id,
                        name,
                        filename,
                        sql: sql.trim()
                    });
                }
            }

            return migrations.sort((a, b) => a.id - b.id);
        } catch (error) {
            console.error('Failed to read migration files:', error);
            throw error;
        }
    }

    /**
     * Get applied migrations from the database
     */
    async getAppliedMigrations(): Promise<Migration[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM schema_migrations ORDER BY id',
                [],
                (err, rows: any[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        const migrations = rows.map(row => ({
                            id: row.id,
                            name: row.name,
                            filename: row.filename,
                            appliedAt: new Date(row.applied_at)
                        }));
                        resolve(migrations);
                    }
                }
            );
        });
    }

    /**
     * Get pending migrations that haven't been applied yet
     */
    async getPendingMigrations(): Promise<Migration[]> {
        const allMigrations = await this.getMigrationFiles();
        const appliedMigrations = await this.getAppliedMigrations();
        const appliedIds = new Set(appliedMigrations.map(m => m.id));

        return allMigrations.filter(migration => !appliedIds.has(migration.id));
    }

    /**
     * Apply a single migration
     */
    async applyMigration(migration: Migration): Promise<MigrationResult> {
        if (!migration.sql) {
            throw new Error(`Migration ${migration.id} has no SQL content`);
        }

        const runAsync = (sql: string, params?: any[]): Promise<void> => {
            return new Promise((resolve, reject) => {
                if (params) {
                    this.db.run(sql, params, function (err) {
                        if (err) reject(err);
                        else resolve();
                    });
                } else {
                    this.db.run(sql, function (err) {
                        if (err) reject(err);
                        else resolve();
                    });
                }
            });
        };

        try {
            console.log(`Applying migration ${migration.id}: ${migration.name}`);

            // Begin transaction
            await runAsync('BEGIN TRANSACTION');

            try {
                // Execute the migration SQL
                const statements = migration.sql.split(';').filter(stmt => stmt.trim());

                for (const statement of statements) {
                    if (statement.trim()) {
                        await runAsync(statement);
                    }
                }

                // Record the migration as applied
                const insertSql = 'INSERT INTO schema_migrations (id, name, filename, applied_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)';
                await runAsync(insertSql, [migration.id, migration.name, migration.filename]);

                // Commit transaction
                await runAsync('COMMIT');

                console.log(`✅ Migration ${migration.id} applied successfully`);
                return { success: true, migration };

            } catch (error) {
                // Rollback on error
                await runAsync('ROLLBACK');
                throw error;
            }

        } catch (error) {
            console.error(`❌ Failed to apply migration ${migration.id}:`, error);
            return { success: false, migration, error: error as Error };
        }
    }

    /**
     * Apply all pending migrations
     */
    async runMigrations(): Promise<MigrationResult[]> {
        await this.initialize();

        const pendingMigrations = await this.getPendingMigrations();

        if (pendingMigrations.length === 0) {
            console.log('✅ No pending migrations');
            return [];
        }

        console.log(`📦 Found ${pendingMigrations.length} pending migration(s)`);

        const results: MigrationResult[] = [];

        for (const migration of pendingMigrations) {
            const result = await this.applyMigration(migration);
            results.push(result);

            // Stop on first failure
            if (!result.success) {
                console.error('❌ Migration failed, stopping migration process');
                break;
            }
        }

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log(`\n📊 Migration Summary:`);
        console.log(`   ✅ Applied: ${successful}`);
        console.log(`   ❌ Failed: ${failed}`);

        return results;
    }

    /**
     * Check if database schema is up to date
     */
    async isUpToDate(): Promise<boolean> {
        const pending = await this.getPendingMigrations();
        return pending.length === 0;
    }
}