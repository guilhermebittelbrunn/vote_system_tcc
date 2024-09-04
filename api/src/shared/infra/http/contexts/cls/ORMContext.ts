
import BaseContext from "@core/infra/BaseContext";
import IOrmContext, { IOrmContextPros } from "../IOrmContext";

export default class ORMContext extends BaseContext<IOrmContextPros> implements IOrmContext {
    name = 'typeorm';
}
