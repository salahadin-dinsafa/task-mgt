import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();
import { PostgresConnectionOptions }
    from "typeorm/driver/postgres/PostgresConnectionOptions";

export const ormConfig = (): PostgresConnectionOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [__dirname + '../../../**/*.entity.{ts,js}'],
    migrations: [__dirname + '/migrations/**/*.{ts,js}']
})

const datasource: DataSource = new DataSource(ormConfig());
export default datasource;