import { describe, it, expect, mock, beforeEach } from "bun:test";
import { PrivateKey as ActualPrivateKey } from "@hiero-ledger/sdk";

// Real keys generated for testing
const KEYS = {
  ECDSA_HEX: "ad5f47d3ffa2d6aa9ae4e3f210c5a8ceea88b99a65cd8ea543639a86dcab3a5d",
  ECDSA_DER: "3030020100300706052b8104000a04220420ad5f47d3ffa2d6aa9ae4e3f210c5a8ceea88b99a65cd8ea543639a86dcab3a5d",
  ED25519_HEX: "4eef1ce3e7d07eb03dc6399700165aa53524386bfc64b4ac97e3f3a855a69a39",
  ED25519_DER: "302e020100300506032b6570042204204eef1ce3e7d07eb03dc6399700165aa53524386bfc64b4ac97e3f3a855a69a39",
};

// Create mock functions for Client
const setOperatorMock = mock((_id: string, _key: any) => ({}));

// Mock the modules before importing the plugin
mock.module("@hiero-ledger/sdk", () => ({
  Client: {
    forTestnet: mock(() => ({
      setOperator: setOperatorMock,
    })),
    forMainnet: mock(() => ({
      setOperator: setOperatorMock,
    })),
    forPreviewnet: mock(() => ({
      setOperator: setOperatorMock,
    })),
  },
  // Use the actual PrivateKey implementation for fromString
  PrivateKey: ActualPrivateKey,
}));

mock.module("@hashgraph/hedera-agent-kit-elizaos", () => ({
  HederaElizaOSToolkit: class {
    getTools = mock(() => [{ name: "test-action" }]);
  },
}));

// Now import the plugin
import hederaPlugin from "../src/adapter-plugin/plugin.ts";

describe("Hedera Plugin - Real Private Key Validation", () => {
  beforeEach(() => {
    setOperatorMock.mockClear();
  });

  const runInit = async (privateKey: string) => {
    const config = {
      HEDERA_PRIVATE_KEY: privateKey,
      HEDERA_ACCOUNT_ID: "0.0.123456",
      HEDERA_NETWORK: "testnet",
    };
    
    const mockRuntime = {
      registerProvider: mock(() => {}),
      registerAction: mock(() => {}),
      getSetting: mock(() => "something"),
    };

    await hederaPlugin.init(config, mockRuntime as any);
  };

  it("should successfully parse real ECDSA HEX key", async () => {
    await runInit(KEYS.ECDSA_HEX);
    expect(setOperatorMock).toHaveBeenCalled();
    const passedKey = setOperatorMock.mock.calls[0][1];
    expect(passedKey.toStringRaw()).toBe(KEYS.ECDSA_HEX);
  });

  it("should successfully parse real ECDSA DER key", async () => {
    await runInit(KEYS.ECDSA_DER);
    expect(setOperatorMock).toHaveBeenCalled();
    const passedKey = setOperatorMock.mock.calls[0][1];
    // DER includes prefix but we can check if it matches the generated one
    expect(passedKey.toString()).toBe(KEYS.ECDSA_DER);
  });

  it("should successfully parse real ED25519 HEX key", async () => {
    await runInit(KEYS.ED25519_HEX);
    expect(setOperatorMock).toHaveBeenCalled();
    const passedKey = setOperatorMock.mock.calls[0][1];
    expect(passedKey.toStringRaw()).toBe(KEYS.ED25519_HEX);
  });

  it("should successfully parse real ED25519 DER key", async () => {
    await runInit(KEYS.ED25519_DER);
    expect(setOperatorMock).toHaveBeenCalled();
    const passedKey = setOperatorMock.mock.calls[0][1];
    expect(passedKey.toString()).toBe(KEYS.ED25519_DER);
  });

  it("should fail for an invalid key string", async () => {
    try {
      await runInit("not-a-key");
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      // The SDK throws a specific error message
      expect(error.message).toBeDefined();
    }
  });
});

describe("Hedera Plugin - Metadata and Network", () => {
  it("should have correct name and description", () => {
    expect(hederaPlugin.name).toBe("plugin-hedera");
    expect(hederaPlugin.description).toBe("Plugin for ElizaOS interactions with Hedera blockchain");
  });

  it("should handle all networks correctly", async () => {
    const networks = ["mainnet", "previewnet", "testnet"] as const;
    
    for (const network of networks) {
      const config = {
        HEDERA_PRIVATE_KEY: KEYS.ECDSA_HEX,
        HEDERA_ACCOUNT_ID: "0.0.123456",
        HEDERA_NETWORK: network,
      };
      
      const mockRuntime = {
        registerProvider: mock(() => {}),
        registerAction: mock(() => {}),
        getSetting: mock(() => "something"),
      };

      await hederaPlugin.init(config, mockRuntime as any);
    }
    
    expect(setOperatorMock).toHaveBeenCalledTimes(3);
  });
});
