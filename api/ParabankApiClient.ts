import { APIRequestContext } from "@playwright/test";

export class ParabankApiClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
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
    customer.id = await this.getCustomerId(
      customer.username,
      customer.password,
    );
    return customer;
  }

  private authenticatedHeaders(username: string, password: string) {
    return {
      Authorization:
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      Accept: "application/json",
    };
  }

  async getCustomerId(username: string, password: string): Promise<string> {
    const response = await this.request.get(
      `/parabank/services/bank/login/${username}/${password}`,
      {
        headers: this.authenticatedHeaders(username, password),
      },
    );

    if (!response.ok()) {
      return "";
    }

    const responseBody = await response.json();
    return responseBody.id;
  }
}
