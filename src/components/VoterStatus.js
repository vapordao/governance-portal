import { connect } from 'react-redux';
import React from 'react';
import styled from 'styled-components';
import { modalOpen } from '../reducers/modal';
import { getActiveAccount } from '../reducers/accounts';
import { Link } from 'react-router-dom';
import theme, { colors, fonts } from '../theme';
import DotSpacer from './DotSpacer';
import { Banner, BannerHeader, BannerBody, BannerContent } from './Banner';
import { cutMiddle } from '../utils/misc';
import Lock from './modals/Lock';
import Withdraw from './modals/Withdraw';

// duplicated in Timeline
const StyledAnchor = styled.a`
  color: #3080ed;
  cursor: pointer;
  padding-bottom: 3px;
  margin-bottom: -3px;
  border-bottom: ${({ noBorder }) => (noBorder ? '' : '1px dashed #317fed')};
`;

const SmallText = styled.p`
  margin-top: 20px;
  margin-bottom: 16px;
  text-align: left;
  line-height: 1.8;
  font-size: ${fonts.size.small};
  color: ${theme.text.dim_grey};
`;

const Value = styled.span`
  color: rgb(${colors.black});
`;

const WelcomeBanner = ({ modalOpen }) => {
  return (
    <Banner>
      <BannerHeader>Welcome to the governance voting dashboard </BannerHeader>
      <BannerBody>
        <BannerContent>
          Before you can get started voting you will need to set up a secure
          voting contract
        </BannerContent>
        <StyledAnchor onClick={() => modalOpen('PROXY_SETUP')}>
          Set up secure voting contract
        </StyledAnchor>
      </BannerBody>
    </Banner>
  );
};

const VoterStatus = ({ account, network, modalOpen }) => {
  if (!account) return null;
  if (account && !account.proxy) return <WelcomeBanner modalOpen={modalOpen} />;

  const domain = `${network === 'kovan' ? 'kovan.' : ''}etherscan.io`;
  const etherscanUrl = `https://${domain}/address/${account.address}`;
  return (
    <SmallText>
      In voting contract <Value>{account.proxy.balance} MKR</Value>{' '}
      <a onClick={() => modalOpen(Withdraw)}>Withdraw to wallet</a>
      <DotSpacer />
      In wallet <Value>{account.coldWallet.balance || 0} MKR</Value>{' '}
      <a onClick={() => modalOpen(Lock)}>Add to voting contract</a>
      <DotSpacer />
      Hot wallet address {cutMiddle(account.address)}{' '}
      <a target="_blank" href={etherscanUrl}>
        Etherscan
      </a>
      <br />
      Currently voting for{' '}
      <Link to="/foundation-proposal/vote-yes-to-the-five-core-principles-of-the-maker-governance-philosophy">
        Vote YES to the five core principles of the Maker Governance philosophy
      </Link>
    </SmallText>
  );
};

const mapStateToProps = state => ({
  account: getActiveAccount(state),
  network: state.metamask.network
});

export default connect(
  mapStateToProps,
  { modalOpen }
)(VoterStatus);
