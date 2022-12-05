import { DataSource } from "typeorm";
import { ormConfig } from "./ormconfig.db";

const datasource: DataSource = new DataSource({
    ...ormConfig(),
    migrations: [__dirname + '/seeds/**/*.{ts,js}']
})

export default datasource;