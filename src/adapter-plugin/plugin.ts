import type { Plugin } from "@elizaos/core";
import { logger } from "@elizaos/core";
import { z } from "zod";
import {
  AgentMode,
  Configuration,
} from "@hashgraph/hedera-agent-kit";
import {
  coreAccountPlugin,
  coreConsensusPlugin,
  coreTokenPlugin,
  coreTokenQueryPlugin,
  coreAccountQueryPlugin,
  coreConsensusQueryPlugin,
  coreEVMPlugin,
  coreEVMQueryPlugin,
  coreMiscQueriesPlugin,
  coreTransactionQueryPlugin,
} from "@hashgraph/hedera-agent-kit/plugins";
import { HederaElizaOSToolkit } from "@hashgraph/hedera-agent-kit-elizaos";
import { Client, PrivateKey } from "@hiero-ledger/sdk";
import { HederaAccountDetails } from "./provider/hederaAccountDetails.ts";

const configSchema = z.object({
  HEDERA_PRIVATE_KEY: z.string(),
  HEDERA_ACCOUNT_ID: z.string(),
  HEDERA_NETWORK: z.enum(["mainnet", "testnet", "previewnet"]).default("testnet"),
});

const produceHederaClient = (
  validatedConfig: z.infer<typeof configSchema>
): Client => {
  const accountId = String(validatedConfig.HEDERA_ACCOUNT_ID).trim();
  const privateKey = PrivateKey.fromString(
    String(validatedConfig.HEDERA_PRIVATE_KEY).trim()
  );

  const network = validatedConfig.HEDERA_NETWORK;
  
  let client: Client;
  switch (network) {
    case "mainnet":
      client = Client.forMainnet();
      break;
    case "previewnet":
      client = Client.forPreviewnet();
      break;
    case "testnet":
    default:
      client = Client.forTestnet();
      break;
  }
  
  return client.setOperator(accountId, privateKey);
};

const hederaPlugin: Plugin = {
  name: "plugin-hedera",
  description: "Plugin for ElizaOS interactions with Hedera blockchain",
  config: {
    HEDERA_PRIVATE_KEY: process.env.HEDERA_PRIVATE_KEY,
    HEDERA_ACCOUNT_ID: process.env.HEDERA_ACCOUNT_ID,
    HEDERA_NETWORK: process.env.HEDERA_NETWORK,
  },

  async init(config: Record<string, string>, runtime) {
    logger.debug("Plugin initialized");
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }

      // Initialize Hedera client
      const client = produceHederaClient(validatedConfig);

      // Initialize configuration
      const configuration: Configuration = {
        plugins: [
          coreTokenPlugin,
          coreTokenQueryPlugin,
          coreAccountPlugin,
          coreAccountQueryPlugin,
          coreConsensusQueryPlugin,
          coreConsensusPlugin,
          coreEVMPlugin,
          coreEVMQueryPlugin,
          coreMiscQueriesPlugin,
          coreTransactionQueryPlugin,
        ],
        context: {
          mode: AgentMode.AUTONOMOUS,
          hooks: [],
        },
      };

      // Initialize and register provider
      runtime.registerProvider(HederaAccountDetails);

      // Create the adapter and get actions
      const toolkit = new HederaElizaOSToolkit({ client, configuration });

      // Register the actions in the runtime
      const actions = toolkit.getTools();
      if (Array.isArray(actions)) {
        actions.forEach((action) => runtime.registerAction(action));
      } else {
        runtime.registerAction(actions);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid plugin configuration: ${error.errors.map((e) => e.message).join(", ")}`
        );
      }
      throw error;
    }
  },
  actions: [], // actions are registered in the plugin init()
  providers: [],
  evaluators: [],
  services: [],
  routes: [],
  events: {},
};

export default hederaPlugin;
