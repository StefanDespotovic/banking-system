import React from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  background: radial-gradient(
    circle at 24.1% 68.8%,
    rgb(0, 75, 101) 0%,
    rgb(0, 0, 0) 99.4%
  );
  border-radius: 10px;
  padding: 16px;
  width: 300px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccountType = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const CardBrand = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const Balance = styled.div`
  font-size: 36px;
  font-weight: 700;
  text-align: right;
`;

const TransactionNumber = styled.div`
  font-size: 16px;
  text-align: center;
`;

const CreditCard = ({
  accountType,
  cardBrand,
  balance,
  transaction_number,
}) => {
  return (
    <CardWrapper>
      <HeaderWrapper>
        <AccountType>{accountType}</AccountType>
        <CardBrand>{cardBrand}</CardBrand>
      </HeaderWrapper>
      <Balance>{`$${balance}`}</Balance>
      <TransactionNumber>{`Transaction number: ${transaction_number}`}</TransactionNumber>
    </CardWrapper>
  );
};

export default CreditCard;
