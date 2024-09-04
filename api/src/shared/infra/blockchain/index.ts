import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';

export class HyperledgerFabricConnection {
    private static contract: any;

    static async getContractInstance() {
        if (!this.contract) {
            const ccpPath = path.resolve(__dirname, 'connection.json');
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);

            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: 'appUser',
                discovery: { enabled: true, asLocalhost: false },
            });

            const network = await gateway.getNetwork('mychannel');
            this.contract = network.getContract('voteContract');
        }
        return this.contract;
    }
}
