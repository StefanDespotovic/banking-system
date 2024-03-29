import React from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  background: radial-gradient(circle at 24.1% 68.8%, #5885af 0%, #274472 99.4%);
  border-radius: 10px;
  padding: 16px;
  width: 19vw;
  height: 22vh;
  min-height: 11rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  @media (max-width: 768px) {
    width: 75vw;
    padding: 1vh 3vw;
    padding-bottom: 3vh;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccountType = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const CardBrand = styled.div`
  font-size: 22px;
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
