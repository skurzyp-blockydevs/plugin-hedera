import { describe, it, expect } from "bun:test";
import { HederaAccountDetails } from "../src/adapter-plugin/provider/hederaAccountDetails.ts";

describe("HederaAccountDetails Provider", () => {
  it("should return account details from runtime settings", async () => {
    const mockAccountId = "0.0.123456";
    const mockRuntime = {
      getSetting: (key: string) => {
        if (key === "HEDERA_ACCOUNT_ID") return mockAccountId;
        return null;
      },
    };

    const result = await HederaAccountDetails.get(mockRuntime as any, {} as any, {} as any);

    expect(result.values?.operatorAccountId).toBe(mockAccountId);
    expect(result.data?.hederaAccountId).toBe(mockAccountId);
    expect(result.text).toContain(mockAccountId);
  });

  it("should handle error when runtime settings are missing", async () => {
    const mockRuntime = {
      getSetting: () => {
        throw new Error("Setting not found");
      },
    };

    const result = await HederaAccountDetails.get(mockRuntime as any, {} as any, {} as any);

    expect(result.values?.error).toBe(true);
    expect(result.text).toBe("Unable to retrieve operator details");
  });
});
