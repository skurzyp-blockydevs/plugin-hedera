# @elizaos-plugins/plugin-hedera

A high‑level integration that lets AI agents built with ElizaOS understand, reason about, and execute on‑chain actions on the Hedera network using natural language.

- What is ElizaOS? An open‑source agent runtime for building autonomous, tool‑using AI agents that can plan and take actions.
- Why use it with Hedera? To give agents fast, low‑cost blockchain execution.
- What value does this plugin add? It connects ElizaOS directly to Hedera via the Hedera Agent Kit, exposing safe, typed tools for transfers, tokens, and queries—so you can build real, useful, on‑chain agents quickly.

Repository scope: This package wraps Hedera Agent Kit tools as an ElizaOS plugin and wires them into the ElizaOS runtime.

## Overview

ElizaOS provides the runtime for AI agents (planning, memory, tools, messaging). The Hedera Agent Kit provides strongly‑typed, batteries‑included functions for common Hedera actions (HBAR transfers, HTS token ops, HCS messages, queries). This plugin bridges the two, so an Eliza agent can call Hedera actions safely via tools.

<<<<<<< HEAD
Who is this for?
- Builders that are experimenting with autonomous agents that take on‑chain actions
- Teams adding blockchain capabilities to assistants, copilots, and workflows
- Educators and docs writers who want a concise, high‑level integration example for Hedera
=======
```env
# Required: Hedera account private key (accepts ED25519 and ECDSA, both DER and HEX encoded)
HEDERA_PRIVATE_KEY=
>>>>>>> origin/1.x

## Why ElizaOS for agents

- Tool‑native architecture: ElizaOS encourages explicit tools and plans, which maps well to deterministic blockchain actions.
- Flexible model providers: Works with OpenAI, Ollama, and others via plugins.
- Production‑ready runtime: Background services, providers, evaluators, and a clean plugin lifecycle.

<<<<<<< HEAD
## Why pair it with Hedera
=======
# Optional: Agent operational mode (defaults to 'provideBytes')
# Options: 'provideBytes', 'scheduleTransaction', 'executeTransaction'
HEDERA_AGENT_MODE=provideBytes
>>>>>>> origin/1.x

- Fast finality and low, predictable fees—ideal for iterative agent behavior
- Native tokenization (HTS) with rich controls and compliance features
- Ordered, verifiable messaging via Hedera Consensus Service (HCS)
- Carbon‑negative network with high throughput and stable costs

## What you can do with Hedera Agent Kit + ElizaOS

Using natural language, agents can:

<<<<<<< HEAD
- Accounts and HBAR
  - Transfer HBAR between accounts
  - Check HBAR and token balances
  - Fetch account details
- Hedera Token Service (HTS)
  - Create fungible tokens
  - Create non‑fungible token (NFT) collections
  - Airdrop fungible tokens to multiple recipients
- Hedera Consensus Service (HCS)
  - Create topics
  - Submit messages to topics
  - Read topic messages
- Queries
  - Retrieve topic messages, account balances, and token balances
=======
**Important:** The minimum required environment variables are:

- `HEDERA_PRIVATE_KEY` - Your Hedera account private key
- `HEDERA_ACCOUNT_ID` - Your Hedera account ID
- `OPENAI_API_KEY` - Required for natural language transaction processing
>>>>>>> origin/1.x

These capabilities come from Hedera Agent Kit (HAK) and are surfaced as ElizaOS tools that an agent can call as part of its plan.

## Architecture at a glance

<<<<<<< HEAD
- At startup the plugin registers the Hedera Agent Kit toolkit with ElizaOS.
- It validates your Hedera credentials, creates a Hedera client (testnet by default), and registers a set of blockchain tools (actions) with the agent runtime.
- Agent prompts/plans then invoke these tools to perform on‑chain operations and return results back into the conversation.
=======
```bash
  bun run dev
```
>>>>>>> origin/1.x

## Common use cases

- Autonomous token treasuries and spend controls on testnet
- NFT minting assistants for creators
- Support bots that fetch balances and account details
- Workflow agents that post auditable messages to HCS topics
- Classroom demos showcasing agent‑to‑chain interactions

## Quick start

### Prerequisites
- Node.js 20+ and Bun (for ElizaOS CLI)
- Hedera Testnet account and private key
- A model provider key (e.g., OpenAI) or use Ollama locally

Install the ElizaOS CLI:

```bash
<<<<<<< HEAD
bun install -g @elizaos/cli
elizaos --version
=======
  bun run dev --characters='../characters/universalHelper.character.json'
>>>>>>> origin/1.x
```

### Clone and set up

<<<<<<< HEAD
```bash
git clone https://github.com/hedera-dev/eliza-plugin-hedera.git
cd eliza-plugin-hedera

# Configure environment
cp .env.example .env
# Fill the variables in .env:
#   HEDERA_PRIVATE_KEY=...
#   HEDERA_ACCOUNT_ID=...
#   OPENAI_API_KEY=...        # or configure Ollama/OpenAI per your model choice

npm install
=======
### Testing

For testing purposes it is recommended to erase agent's memory on the app start.
This helps you achieve clean environment and erases impact of previously called actions and passed prompts which helps to test new changes during development.
To erase agent's memory and run Eliza with recommended character use following script

```bash
  rm ./agent/data/db.sqlite ; bun run dev --character ./characters/universalHelper.character.json
```

---

## Provider

Plugin implements provider creating instance of `HederaAgentKit` from
`hedera-agent-kit`. `HederaAgentKit` offers API for interacting with Hedera blockchain and supports executing of operations called from actions.

Provider contains method `get()` that is called after each input given by user. It takes care of refreshing amount of HBAR held by connected account and stored in agent's memory - state.

Connected wallet is considered to be the agent's property. Due to that fact for extracting knowledge about connected wallet's HBAR balance use the following prompt:

1. User input

```
What's yours HBAR balance?
```

2. Response from LLM based on stored context:

```
My current HBAR balance is 999.81307987 HBAR.
>>>>>>> origin/1.x
```

### Run the agent

<<<<<<< HEAD
```bash
elizaos dev
```

The plugin loads into the Eliza agent. You can now use natural language to perform Hedera actions.

### Required environment variables
- HEDERA_PRIVATE_KEY — Your Hedera account private key (DER/HEX; ED25519 or ECDSA)
- HEDERA_ACCOUNT_ID — Your Hedera account ID (e.g., 0.0.5393196)
- OPENAI_API_KEY — If using OpenAI; otherwise configure your chosen model provider (e.g., Ollama) via its plugin

## Example prompts

- Account operations
  - "What’s my HBAR balance?"
  - "Transfer 5 HBAR to account 0.0.123456"
- Token operations
  - "Create fungible token Test with symbol TST, 4 decimals, and 1000 initial supply. Set supply key."
  - "Create an NFT collection called Digital Art with symbol DART"
  - "Airdrop 10 tokens of 0.0.7654321 to accounts 0.0.111111 and 0.0.222222"
- Consensus operations
  - "Create a topic with memo ‘Example Topic’"
  - "Submit message ‘Hello Hedera world!’ to topic 0.0.1231234"
  - "Show messages for topic 0.0.1231234"
- Query operations
  - "Show details for account 0.0.123456"
  - "What tokens do I own?"

Note: ElizaOS agents typically execute tools immediately (no human‑in‑the‑loop). Use small amounts on testnet and review prompts for safety.

## Security and best practices

- Use Hedera Testnet for experimentation; limit value at risk.
- Scope tool permissions and validate inputs in prompts where possible.
- Store secrets in environment variables; never commit keys.
- Consider human‑in‑the‑loop review for high‑risk actions in production.
=======
---

## Actions

The plugin provides a streamlined set of actions for Hedera blockchain operations and OpenConvAI interactions:

### HEDERA_CREATE_TRANSACTION

**Universal Transaction Action** - A powerful general-purpose action that processes natural language requests to create and execute any type of transaction on the Hedera network.

This action uses the `hedera-agent-kit.processMessage()` method to intelligently parse user requests and execute the appropriate Hedera operations, including:

- **HBAR Transfers** - Send HBAR between accounts with optional memos
- **HCS Topic Operations** - Create topics, submit messages, manage topic settings
- **HTS Token Operations** - Create fungible/non-fungible tokens, mint, transfer, associate/dissociate
- **Account Management** - Check balances, token holdings, pending airdrops
- **Advanced Operations** - Token airdrops, supply management, metadata updates

#### Key Features:

- **Natural Language Processing** - Simply describe what you want to do in plain English
- **Intelligent Parsing** - Automatically extracts transaction details from user requests
- **Comprehensive Coverage** - Handles all major Hedera operations through a single action
- **Error Handling** - Provides clear feedback on transaction success or failure
- **Transaction Links** - Returns hashscan.io links for easy verification

#### Example Prompts:

**HBAR Transfer:**

```
Transfer 150 hbar to Hedera account 0.0.12345 and memo it 'Payment for services'
```

**Create HCS Topic:**

```
On Hedera, create a new HCS topic with the memo 'Weekly project updates'
```

**Token Creation:**

```
Create a new Hedera fungible token named 'SuperCoin' with symbol 'SPC', initial supply of 1 million, and 2 decimal places
```

**NFT Minting:**

```
Mint 500 units of my Hedera NFT collection with token ID 0.0.78901
```

**Token Association:**

```
Associate Hedera token 0.0.98765 with my account
```

**Check Balances:**

```
Show me HBAR balance of wallet 0.0.5423981
What are my HTS token balances?
```

**Topic Messaging:**

```
Submit message 'Hello World' to topic 0.0.123456
Get messages from topic 0.0.123456 posted after yesterday
```

**Token Operations:**

```
Airdrop 100 tokens 0.0.5450181 to accounts 0.0.5450165 and 0.0.5450137
Mint 1000 additional tokens for token ID 0.0.5478757
```
>>>>>>> origin/1.x

## Developer notes

- Built on [`hedera-agent-kit`](https://github.com/hedera-dev/hedera-agent-kit)
- Registers core plugins: Accounts, HTS, HCS (Consensus), and Queries
- Defaults to Hedera Testnet

<<<<<<< HEAD
## Where to go next
=======
### HEDERA_FIND_REGISTRATIONS
>>>>>>> origin/1.x

- Hedera Agent Kit (SDK, docs, examples): https://github.com/hedera-dev/hedera-agent-kit
- Hedera Docs (HTS, HCS, SDKs): https://docs.hedera.com/
- ElizaOS (runtime and docs): https://elizaos.ai

## Contributing

<<<<<<< HEAD
Issues and PRs are welcome. For significant changes, please open an issue first to discuss what you’d like to change.
=======
#### Example Prompts:

```
Find agent registrations on Hedera
Find agent with account ID 0.0.12345
Find all agents with TEXT_GENERATION capability
```

---

### HEDERA_RETRIEVE_PROFILE

**HCS-11 Profile Retrieval** - Retrieve standardized agent profiles using the HCS-11 profile standard.

This action fetches detailed profile information for AI agents, including their capabilities, metadata, and communication channels as defined by the HCS-11 standard.

#### Example Prompts:

```
Get the HCS-11 profile for account 0.0.12345
Retrieve your current agent profile
Show me the profile details for agent 0.0.98765
```

---

## OpenConvAI Client

The plugin includes an OpenConvAI client interface that enables participation in the HCS-10 standard for decentralized AI agent communication. This allows your agent to:

- Register in the OpenConvAI agent registry
- Discover and communicate with other agents
- Participate in the decentralized agent ecosystem
- Handle secure agent-to-agent connections

---

## Supported Operations via HEDERA_CREATE_TRANSACTION

All the following operations are now handled through natural language requests to the `HEDERA_CREATE_TRANSACTION` action:

**Account & Balance Operations:**

- Check HBAR balances for any account
- Check HTS token balances (individual or all tokens)
- View token holders and distribution
- Show pending airdrops

**Token Operations:**

- Create fungible tokens with custom parameters
- Create and mint NFTs
- Associate/dissociate tokens
- Transfer HBAR and HTS tokens
- Airdrop tokens to multiple recipients
- Claim pending airdrops
- Reject unwanted tokens
- Mint additional supply (with supply key)

**HCS Topic Operations:**

- Create new topics with optional submit keys
- Submit messages to topics
- Retrieve topic information and metadata
- Fetch messages from topics (with optional time filtering)
- Delete topics (with admin key)

**Example Natural Language Requests:**

```
"Show me HBAR balance of wallet 0.0.5423981"
"Create token GameGold with symbol GG, 2 decimals, and 750000 supply"
"Transfer 150 hbar to account 0.0.12345 with memo 'Payment for services'"
"Airdrop 100 tokens 0.0.5450181 to accounts 0.0.5450165 and 0.0.5450137"
"Create topic with memo 'Weekly updates' and set submit key"
"Get messages from topic 0.0.5473710 posted after yesterday"
```

---

## Architecture

The plugin integrates with several key components:

- **HederaProvider**: Creates and manages `HederaAgentKit` instances
- **HederaAgentKit**: Core library for Hedera blockchain operations
- **OpenConvAI Client**: Handles HCS-10 standard agent communications
- **Natural Language Processing**: Powered by ElizaOS for intelligent transaction parsing

## Dependencies

This plugin depends on the following libraries:

- `@hashgraphonline/hedera-agent-kit` - Core Hedera operations
- `@elizaos/core` - ElizaOS framework integration
- `@hashgraph/sdk` - Official Hedera SDK
- `zod` - Schema validation

## Future Enhancements

The plugin continues to evolve with planned improvements:

- Enhanced natural language understanding
- Additional Hedera service integrations
- Improved error handling and validation
- Extended OpenConvAI functionality
- Performance optimizations

## Legacy Reference

Previously, this plugin had separate actions for each operation type (HBAR_BALANCE, CREATE_TOKEN, etc.). These have been consolidated into the single `HEDERA_CREATE_TRANSACTION` action for better user experience and maintainability. All previous functionality remains available through natural language requests.

---

## Contribution

The plugin is still in development phase. It heavily depends on `hedera-agent-kit` library that is also under development.
Consider this code as an evolving implementation that continues to improve.

Areas of ongoing development:

- Enhanced natural language processing capabilities
- Additional Hedera service integrations
- Improved OpenConvAI standard support
- Extended testing coverage

## Running Tests

This project communicates with an **ElizaOS instance** via REST API on the default port **`localhost:3000`**.

- Test cases **send messages to the AI agent**, which triggers relevant actions and returns responses
- The responses are **parsed**, and important data is extracted
- Based on this extracted data, tests perform **validations** using the **Hedera Mirror Node API** as the source of truth

#### Important Information

- **Mirror Node delay:** The Hedera Mirror Node has a slight delay, so additional waiting time is required between performing an action and checking the results
- **Sequential execution only:**
  - Tests **cannot** run in parallel because requests and responses from the agent **must be processed in chronological order**
  - Concurrent testing is **disabled**, and additional timeouts are introduced before each test to improve reliability

#### Environment Setup

The `.env` file should contain the **same wallet information** as the running ElizaOS instance.  
Use the `.env.example` file as a reference.

🦁
>>>>>>> origin/1.x
