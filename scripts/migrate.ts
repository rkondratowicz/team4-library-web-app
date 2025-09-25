#!/usr/bin/env tsx

import sqlite3 from 'sqlite3';
import path from 'path';
import { MigrationService } from '../src/services/MigrationService.js';

/**
 * Migration runner script
 * This script runs all pending database migrations
 */

const dbPath = path.join(process.cwd(), 'library.db');
const migrationsPath = path.join(process.cwd(), 'migrations');

async function runMigrations(): Promise<void> {
    console.log('🚀 Starting database migrations...');
    console.log(`📄 Database: ${dbPath}`);
    console.log(`📁 Migrations: ${migrationsPath}`);
    console.log('');

    // Initialize database connection
    const db = new sqlite3.Database(dbPath);

    try {
        // Create migration service
        const migrationService = new MigrationService(db, migrationsPath);

        // Run all pending migrations
        const results = await migrationService.runMigrations();

        if (results.length === 0) {
            console.log('✅ Database is already up to date!');
        } else {
            console.log('\n🎉 Migration process completed successfully!');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        // Close database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('📄 Database connection closed');
            }
        });
    }
}

// Run migrations if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations().catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

export { runMigrations };