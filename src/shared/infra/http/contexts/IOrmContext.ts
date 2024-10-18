import ContextHandler from "@core/infra/ContextHandler";
import { QueryRunner } from "typeorm";

export interface IOrmContextPros {
    queryRunner: QueryRunner;
}

type IOrmContext = ContextHandler<IOrmContextPros>;

export default IOrmContext;
