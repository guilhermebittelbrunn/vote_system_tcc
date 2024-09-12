import { PolygonWeb3 } from "../../services/implementations/PolygonNetwork";
import RegisterBlock from "./registerBlock";
import RegisterBlockController from "./registerBlockController";


const polygonNetwork = new PolygonWeb3();

const registerBlock = new RegisterBlock(polygonNetwork);

const registerBlockController = new RegisterBlockController(registerBlock);

export { registerBlock, registerBlockController };
