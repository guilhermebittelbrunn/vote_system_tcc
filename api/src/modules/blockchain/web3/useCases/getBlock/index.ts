import { PolygonWeb3 } from "../../services/implementations/PolygonNetwork";
import GetBlock from "./getBlock";
import GetBlockController from "./getBlockController";

const polygonNetwork = new PolygonWeb3();

const getBlock = new GetBlock(polygonNetwork);

const getBlockController = new GetBlockController(getBlock);

export { getBlock, getBlockController };
