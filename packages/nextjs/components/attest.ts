import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import toast from "react-hot-toast";



export const Attest = async (signer: any, hackName: string, address: string) => {

    const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
    const schemaUID = "0x3b1be860b499c1c49462c79befd38034914a97ff2e9e1648529106d9b271f65e";
    "0x8d915de0951fc02b7f25f1744f77737e017ffb132057b5debd0c9ec7df2cc343";
    const eas = new EAS(easContractAddress);
    // Signer must be an ethers-like signer.

    if (!signer) return;
    eas.connect(signer);
    // Initialize SchemaEncoder with the schema string
    const offchain = await eas.getOffchain();
    const schemaEncoder = new SchemaEncoder("string hackName");
    const encodedData = schemaEncoder.encodeData([
        { name: "hackName", value: hackName, type: "string" }
    ]);
    const offchainAttestation = await offchain.signOffchainAttestation({
        recipient: address,
        // Unix timestamp of when attestation expires. (0 for no expiration)
        expirationTime: BigInt(0),
        // Unix timestamp of current time
        time: BigInt(1671219636),
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        nonce: BigInt(0),
        schema: schemaUID,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: encodedData,
    }, signer);

    toast.success("Attesting Hack!");
    const uid = offchainAttestation.uid;

    console.log(uid);
    return uid;
}
