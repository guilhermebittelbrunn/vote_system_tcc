import { PolygonWeb3 } from "../../services/implementations/PolygonNetwork";
import GetBlockData from "./getBlockData";
import GetBlockDataController from "./getBlockDataController";

const polygonNetwork = new PolygonWeb3();

const getBlockData = new GetBlockData(polygonNetwork);

const getBlockControllerData = new GetBlockDataController(getBlockData);

export { getBlockData, getBlockControllerData };
