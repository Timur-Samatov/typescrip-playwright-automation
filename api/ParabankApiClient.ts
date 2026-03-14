import { APIRequestContext } from "@playwright/test";
import { AccountType, getAccountTypeId } from "../models/AccountType";

export class ParabankApiClient {
  private readonly request: APIRequestContext;
  private username?: string;
  private password?: string;

  constructor(
    request: APIRequestContext,
    username?: string,
    password?: string,
  ) {
    this.request = request;
    this.username = username;
    this.password = password;
  }

  /**
   * Registers a new user with the ParaBank API.
   * @param {boolean} uniqueSuffix - If true, a unique suffix will be added to the username and password.
   * @returns {Promise<any>} The customer object.
   */
  async registerNewUser({ uniqueSuffix = true } = {}): Promise<any> {
    const timestamp = Date.now();

    // userData taken from .env file
    const userData = {
      firstName: process.env.USER_FULLNAME_1.split(" ")[0],
      lastName: process.env.USER_FULLNAME_1.split(" ")[1],
      userName: process.env.USERNAME_1,
      password: process.env.PASSWORD_1,
    };

    const customer = {
      firstName: uniqueSuffix
        ? userData.firstName + timestamp
        : userData.firstName,
      lastName: uniqueSuffix
        ? userData.lastName + timestamp
        : userData.lastName,
      fullName: "",
      address: {
        street: "TestStreet",
        city: "TestCity",
        state: "TestState",
        zipCode: "12345",
      },
      username: uniqueSuffix
        ? userData.userName + timestamp
        : userData.userName,
      password: userData.password,
      phoneNumber: "5551234567",
      ssn: "11111111",
      id: "",
    };
    customer.fullName = `${customer.firstName} ${customer.lastName}`;

    // Initial request to setup session/cookies
    await this.request.get("/parabank/register.htm");

    const formBody = {
      "customer.firstName": customer.firstName,
      "customer.lastName": customer.lastName,
      "customer.address.street": customer.address.street,
      "customer.address.city": customer.address.city,
      "customer.address.state": customer.address.state,
      "customer.address.zipCode": customer.address.zipCode,
      "customer.phoneNumber": customer.phoneNumber,
      "customer.ssn": customer.ssn,
      "customer.username": customer.username,
      "customer.password": customer.password,
      repeatedPassword: customer.password,
    };

    const response = await this.request.post("/parabank/register.htm", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      form: formBody,
    });

    if (!response.ok()) {
      throw new Error(`Registration failed with status ${response.status()}`);
    }

    // Get customer ID after registration
    this.username = customer.username;
    this.password = customer.password;
    customer.id = await this.getCustomerId();
    return customer;
  }

  private authenticatedHeaders() {
    if (!this.username || !this.password) {
      throw new Error("Credentials are not set on API client");
    }
    return {
      Authorization:
        "Basic " +
        Buffer.from(`${this.username}:${this.password}`).toString("base64"),
      Accept: "application/json",
    };
  }

  private async authGet(url: string, options: any = {}) {
    return this.request.get(url, {
      ...options,
      headers: {
        ...this.authenticatedHeaders(),
        ...options.headers,
      },
    });
  }

  private async authPost(url: string, options: any = {}) {
    return this.request.post(url, {
      ...options,
      headers: {
        ...this.authenticatedHeaders(),
        ...options.headers,
      },
    });
  }

  private async authPut(url: string, options: any = {}) {
    return this.request.put(url, {
      ...options,
      headers: {
        ...this.authenticatedHeaders(),
        ...options.headers,
      },
    });
  }

  private async authDelete(url: string, options: any = {}) {
    return this.request.delete(url, {
      ...options,
      headers: {
        ...this.authenticatedHeaders(),
        ...options.headers,
      },
    });
  }

  async getCustomerId(): Promise<string> {
    const response = await this.authGet(
      `/parabank/services/bank/login/${this.username}/${this.password}`,
    );

    if (!response.ok()) {
      return "";
    }

    const responseBody = await response.json();
    return responseBody.id;
  }
  /**
   * Retrieves a list of accounts for a specific customer.
   * @param {string} customerId - The ID of the customer.
   * @returns {Promise<any>} The list of accounts.
   */
  async getAccountsByCustomerId(customerId: string): Promise<any> {
    const response = await this.authGet(
      `/parabank/services/bank/customers/${customerId}/accounts`,
    );

    if (!response.ok()) {
      return "";
    }

    const responseBody = await response.json();
    return responseBody;
  }

  /**
   * Creates a new account for a customer.
   * @param {object} params - The parameters for creating a new account.
   * @param {number} params.customerId - The ID of the customer.
   * @param {number} params.fromAccountId - The ID of the account to transfer funds from.
   * @param {AccountType} params.newAccountType - The type of the account.
   * @returns {Promise<any>} The account object and response status.
   */
  async createAccount({
    customerId,
    fromAccountId,
    newAccountType,
  }: {
    customerId: number;
    fromAccountId: number;
    newAccountType: AccountType;
  }): Promise<any> {
    const response = await this.authPost(
      `/parabank/services/bank/createAccount`,
      {
        params: {
          customerId,
          fromAccountId,
          newAccountType: getAccountTypeId(newAccountType),
        },
      },
    );

    if (!response.ok()) {
      return { status: response.status() };
    }

    const responseBody = await response.json();
    return { status: response.status(), data: responseBody };
  }
}
