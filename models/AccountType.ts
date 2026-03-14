export enum AccountType {
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
  LOAN = "LOAN",
}

export const getAccountTypeId = (type: AccountType): number => {
  const mapping: Record<AccountType, number> = {
    [AccountType.CHECKING]: 0,
    [AccountType.SAVINGS]: 1,
    [AccountType.LOAN]: 2,
  };
  return mapping[type];
};
