const Container = styled.div`
* {
	margin: 0;
	padding: 0;
	text-indent: 0;
}

h1 {
	color: black;
	font-style: normal;
	font-weight: bold;
	text-decoration: none;
	font-size: 15pt;
}

.h2,
h2 {
	color: black;
	font-style: normal;
	font-weight: bold;
	text-decoration: none;
	font-size: 11pt;
}

.s3 {
	color: black;
	font-style: normal;
	font-weight: normal;
	text-decoration: none;
	font-size: 11pt;
}

li {
	display: block;
}

#l1 {
	padding-left: 0pt;
	counter-reset: c1 1;
}

body {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 30px 15px;
}

.main {
	margin: 40px 0;
}

.h2 {
	color: black;
	font-style: normal;
	font-weight: 800;
	text-decoration: none;
	font-size: 11pt;
}

.s3 {
	font-style: normal;
	font-weight: normal;
	text-decoration: none;
	font-size: 11pt;
}

.main h1 {
	font-size: 20px;
	font-weight: 800;
	text-align: center;
}

.header-text {
	margin-top: 20px;
	width: 100%;
	justify-self: flex-start;

}

.header-text {
	font-style: normal;
	font-weight: normal;
	margin-bottom: 30px;
	font-size: 18px;
}

.header-text-2 {
	font-style: normal;
	font-weight: normal;
	padding: 10px 0;
	font-size: 16px;
}

.para-1 {
	font-style: normal;
	font-weight: normal;
	font-family: "Trebuchet MS", sans-serif;
	font-size: 16px;
}

.para-x {
	font-style: normal;
	font-weight: normal;
	font-family: "Trebuchet MS", sans-serif;
	font-size: 16px;
}

.single-type {
	margin-left: 25px;
}

.single-type1 {
	text-transform: uppercase;
	font-size: 16px;
	margin-left: 25px;
}

.list-items {
	padding: 30px 0;
	display: flex;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
}

.second-list {
	padding: 10px 0;
	display: flex;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
}

.list-item {
	padding: 5px 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
}

.list-item-text {
	font-style: normal;
	font-weight: normal;
	padding: 5px 0;
	font-size: 18px;

}

.list-item-number {
	color: black;
	font-style: normal;
	font-weight: bold;
	text-decoration: none;
	font-size: 11pt;
	margin-right: 12px;
}

.list-item-title {
	color: black;
	font-style: normal;
	font-weight: bold;
	text-decoration: none;
	font-size: 12pt;
	padding: 10px 0;
}

.subs {
	padding: 10px 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	width: 100%;

}

.ordered-list-item {
	padding: 2px 0;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	font-size: 16px;
	text-align: left;
	width: 100%;

}

.ordered-list-item-span {
	font-size: 15px;
	margin-right: 10px;

}

}`;

return (
  <Container>
    <div className="container">
      <div className="main">
        <h1>
          Templar Foundation Grant Programme <br /> Terms and Conditions
        </h1>
      </div>
      <div className="header-text">
        <h4 className="header-text">Last updated: 21 June 2024</h4>
      </div>
      <br />
      <br />
      <div className="headertext-2">
        <p className="para-1">
          These terms and conditions are entered into by and between you (“
          <span className="h2">Recipient</span>” or “
          <span className="h2">you</span>” or “<span className="h2">your</span>
          ”) and Templar Foundation (“<span className="h2">Foundation</span>”, “
          <span className="h2">we</span>” or “<span className="h2">us</span>”).
          Please read these terms and conditions (“
          <span className="h2">Terms</span>”) carefully before submitting your
          Proposal to the Relevant Community (as defined below) under the
          Foundation’s Grant Program (“<span className="h2">Grant</span>”). By
          proceeding with the submission of your Proposal you are accepting to
          be bound by these Terms. These Terms, together with any documents they
          expressly incorporate by reference, govern your receipt and use of the
          Grant
        </p>
      </div>
      <div className="list-items">
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">1.</span>Introduction
          </h4>
          <div className="headertext-2">
            <p className="para-1">
              The Foundation promotes the growth of the NEAR community and its
              associate ecosystem, and offers grants to support the community in
              helping further these goals. The Grant shall be used according to
              the approved Proposal, to further the development of the NEAR
              Protocol and its associated Ecosystem (as defined below) (“
              <span className="h2">Purpose</span>”). The Foundation provides the
              Grant under these Terms and the Grant shall be used exclusively
              for the Purpose.
            </p>
          </div>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">2.</span>Defined Terms
          </h4>
          <div className="headertext-2">
            <h4 className="header-text-2">
              <span>2.1</span> In these Terms, the following definitions will
              apply:
            </h4>

            <li className="list-item-text">
              <span className="list-item-number">Aﬃliate:</span>
              <p className="para-x">
                In respect of a party any person who, directly or indirectly,
                controls, is controlled by, or is under common control with that
                party, and for these purposes “control” and “controlling” are
                defined as directly or indirectly possessing the power to direct
                or cause the direction of the management and policies of such a
                person, whether through ownership of voting interests, by
                contract or otherwise;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">
                Applicable Production Laws:
              </span>{" "}
              <p className="para-x">
                All applicable laws (including securities laws), statutes,
                regulations and codes from time to time in force;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">Applicable Laws:</span>
              <p className="para-x">
                All Applicable Laws relating to data processing, protection, and
                the privacy of individuals, including the UK GDPR (as defined in
                section 3(10), as supplemented by section 205(4), of the UK’s
                Data Protection Act 2018) and the EU GDPR (General Data
                Protection Regulation (EU) 2016/679));
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">B.O.S:</span>{" "}
              <p className="para-x">
                the common layer for browsing and interacting with the “open
                web” (compatible with any blockchain), known as the “NEAR
                Blockchain Operating System” or “B.O.S.”;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">Business Day:</span>{" "}
              <p className="para-x">
                a day, other than a Saturday, Sunday or public holiday in
                Cayman, when banks are open for business;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">Business Hours:</span>{" "}
              <p className="para-x">
                the period from 9.00 am to 5.00 pm on any Business Day;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">Change Control:</span>{" "}
              <p className="para-x">
                where a person or entity who Controls any body corporate ceases
                to do so or if another person or entity acquires Control of it.
                For these purposes, “Control” means in relation to a body
                corporate, the power of a person or entity to secure that the
                affairs of the body corporate are conducted in accordance with
                the wishes of that person or entity: by means of the holding of
                shares, or the possession of voting power, in or in relation to
                that or any other body corporate; or as a result of any powers
                conferred by the constitution, articles of association or any
                other document regulating that or any other body corporate
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">
                Confidential Information:
              </span>{" "}
              <p className="para-x">
                Means all information of a confidential and proprietary nature,
                whether created before or after the date of these Terms, which
                the disclosing Party (“
                <span className="h2">Disclosing Party</span>
                <i>”</i>) or its representatives directly or indirectly
                discloses, or makes available, to the receiving Party (“
                <span className="h2">Receiving Party</span>
                <i>”</i>) or its representatives or any of its Affiliates, or
                their Representatives before, on or after the date of these
                Terms, including:
              </p>
            </li>
            <ol className="ordered-list-items">
              <li className="ordered-list-item">
                {" "}
                <p className="para-x">
                  All business, financial, technical, operational, commercial,
                  employee, management and other information, data, experience
                  and expertise of whatever kind (including
                </p>
              </li>
              <li className="ordered-list-item">
                <p className="para-x">
                  Information relating to trade secrets, know-how, designs,
                  software (both source code and object code), intellectual
                  property rights, inventions, patents, technology, operations,
                  processes, plans, intentions, product information and
                  development, marketing knowledge, marketing opportunities and
                  sales information, business plans and dealings, financial
                  information, forecasts, budgets, and plans, historic and
                  current and future transactions, affairs and/or business) of
                  the Disclosing Party; and
                </p>
              </li>
              <li className="ordered-list-item">
                <p className="para-x">
                  Information derived from information falling within paragraph
                  (i) above including analyses, compilations, studies and other
                  documents prepared by any Party to these Terms or on their
                  behalf which contain or otherwise reflect or are generated
                  from the information specified in paragraph (ii);
                </p>
              </li>
            </ol>

            <ol className="ordered-list-items">
              <li data-list-text="i.">
                <p className="para-x">
                  Is in the public domain at the time of disclosure or which
                  subsequently comes into the public domain through no breach of
                  these Terms by the Receiving Party;
                </p>
              </li>
              <li data-list-text="ii.">
                <p className="para-x">
                  Was already lawfully in the possession of the Receiving Party
                  prior to its disclosure by the Disclosing Party;
                </p>
              </li>
              <li data-list-text="iii.">
                <p className="para-x">
                  Is subsequently disclosed to the Receiving Party by a third
                  Party who, to the Receiving Party’s knowledge, did not breach
                  any confidentiality obligations in respect of the information
                  and/or from someone owing a duty of confidence to the
                  Disclosing Party; or
                </p>
              </li>
              <li data-list-text="iv.">
                <p className="para-x">
                  The Parties have agreed in writing that it is not
                  confidential.
                </p>
              </li>
            </ol>
            <li className="list-item-text">
              <span className="list-item-number">Grant:</span>
              <p className="para-x">
                The grant given by the Foundation to you pursuant to, and in
                accordance with these Terms, following Proposal approval by the
                Relevant Community;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">
                Intellectual Property Rights:{" "}
              </span>{" "}
              <p className="para-x">
                Patent rights (including patent applications and disclosures),
                copyrights, trademarks, trade secret rights, business names and
                domain names, goodwill and the right to sue for passing off,
                rights in designs, rights in computer software, database rights,
                rights to use, and protect the confidentiality of, confidential
                information (including know-how and trade secrets) and all other
                intellectual property rights, in each case whether registered or
                unregistered and including all applications and rights to apply
                for and be granted, renewals or extensions of, and rights to
                claim priority from, such rights and all similar or equivalent
                rights or forms of protection which subsist or will subsist now
                or in the future in any part of the world;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">NEAR Ecosystem:</span>{" "}
              <p className="para-x">
                The NEAR Technology’s ecosystem, comprised of the projects and
                applications that have been or are being developed and/or built
                on, or are running on, the NEAR Technology and their respective
                communities, contributors and developers;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">NEAR Protocol:</span>{" "}
              <p className="para-x">
                the sharded, developer-friendly, proof-of-stake, layer one
                blockchain, known as “NEAR Protocol”;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">NEAR Technology:</span>
              <p className="para-x">B.O.S. and NEAR Protocol;</p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">NEAR Tokens:</span>{" "}
              <p className="para-x">
                The native cryptographic currency of the NEAR Protocol;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">Proposal:</span>{" "}
              <p className="para-x">
                Funding proposals submitted to the Relevant Community by members
                of the NEAR ecosystem for products and/or services connected to
                the Purpose. Relevant Community and/or Supervisor’s approval of
                the Proposal is a condition of the Grant;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">Relevant Community:</span>{" "}
              <p className="para-x">
                NEAR Ecosystem community responsible for the approval of the
                Proposal through the NEAR Ecosystem governance system.
                Communities are responsible for the approval of Proposals
                entitled to receive the Grants. For the purpose of these Terms,
                the term ‘’(“<span className="h2">Relevant Communities</span>
                <i>”</i>) here include but is not limited to DevHub, Events
                Committee and Education Committee;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">Software:</span>
              <p className="para-x">
                Any software (of whatever nature) created, developed and/or
                deployed of software in respect of achieving the Purpose;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">Supervisors:</span>
              <p className="para-x">
                Any moderator or appointed representative of the Relevant
                Community responsible for reviewing, analyzing and/or approving
                the Proposals;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">Tokens:</span>{" "}
              <p className="para-x">
                any cryptographical coin, token or currency, including (without
                limitation) USDC, USDT and the NEAR Token;
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">USDC:</span>
              <p className="para-x">
                USD Coin (USDC), the stablecoin pegged to the US Dollar and
                originally issued by Circle, native to the NEAR Protocol; and
              </p>
            </li>
            <li className="list-item-text">
              <span className="list-item-number">USDT:</span>{" "}
              <p className="para-x">
                Tether (USDT), the stablecoin pegged to the US Dollar and
                originally issued by Tether, native to the NEAR Protocol.
              </p>
            </li>
          </div>
        </div>

        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">3.</span>Grant Payment
          </h4>
          <ol className="ordered-list-items">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">3.1</span>
              <p className="para-x">
                The Grant will be disbursed in accordance with the Foundation’s
                policies upon submission of an invoice by you and subject to
                successful KYC/AML checks;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">3.2</span>
              <p className="para-x">
                You must use the Grant exclusively for the Purposes and in
                accordance with these Terms. Any deviation from the agreed-upon
                use of the Grant without prior written approval from the
                Foundation and the Relevant Community will constitute a breach
                of these Terms.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">3.3</span>
              <p className="para-x">
                The Foundation reserves the right to request a detailed report
                on the use of the Grant funds. You are required to provide such
                a report within reasonable time. Failure by you to comply with
                the terms of the Grant payment, including but not limited to the
                misuse of funds or failure to provide required reports, may
                result in the suspension or termination of the Grant and the
                requirement to repay any disbursed funds.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">3.4</span>
              <p className="para-x">
                The Foundation reserves the right to conduct due diligence in
                respect of you as it sees fit, which may include “Know Your
                Client” (KYC), “Know Your Business” (KYB), anti-money laundering
                (AML), and/or sanctions, checks (“Due Diligence”). The
                settlement of an invoice is conditional on satisfactory
                completion of Due Diligence. You agree to cooperate with the
                Foundation in respect of Due Diligence.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">3.5</span>
              <p className="para-x">
                If the Grant (in whole or in part) is subject to currency
                conversion, unless determined otherwise by the Foundation, the
                Foundation will use reasonable efforts to calculate the
                conversion based on the closing spot exchange rate for the
                relevant currency pair as made available on CoinMarketCap
                (https://coinmarketcap.com) or any similar price-tracking
                website applicable on the date of the relevant invoice.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">3.6</span>
              <p className="para-x">
                All costs relating to pursuing the Purpose will be borne by you.
              </p>
            </li>
          </ol>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">4.</span>Tokens As Grant Payment
          </h4>

          <ul>
            <div className="subs">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">4.1.1</span>
                <p className="para-x">
                  If any cryptographic tokens, e.g. USDT, USDC or $NEAR,(“
                  <span className="h2">Tokens</span>”) are used for the Grant
                  payment, the Foundation provides no representation, warranty
                  or assurance regarding:
                </p>
              </li>

              <ol className="ordered-list-items">
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.1.1</span>
                  <p className="para-x">
                    the accuracy or completeness of information in any
                    whitepaper or documentation related to the blockchain or
                    protocol (whether NEAR Protocol or any other blockchain or
                    protocol) on which the Tokens exist(“
                    <span className="h2">Relevant Protocol</span>”);
                  </p>
                </li>
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.1.2</span>
                  <p className="para-x">
                    liabilities, obligations, value, utility, fungibility, or
                    proprietary rights associated with the Tokens;
                  </p>
                </li>
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.1.3</span>
                  <p className="para-x">
                    Intellectual Property Rights in the Tokens;
                  </p>
                </li>
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.1.4</span>
                  <p className="para-x">
                    Fitness of the Tokens or Relevant Protocol for a particular
                    purpose;
                  </p>
                </li>
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.1.5</span>
                  <p className="para-x">
                    Whether the Tokens are securities or regulated investments;
                  </p>
                </li>
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.1.6</span>
                  <p className="para-x">
                    Compliance of the Token provision with Applicable Laws;
                  </p>
                </li>
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.1.7</span>
                  <p className="para-x">success of the Relevant Protocol;</p>
                </li>
              </ol>
            </div>
            <div className="subs">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">4.1.2</span>
                <p className="para-x">
                  If any cryptographic tokens, e.g. USDT, USDC or $NEAR,(“
                  <span className="h2">Tokens</span>”) are used for the Grant
                  payment, the Foundation provides no representation, warranty
                  or assurance regarding:
                </p>
              </li>
              <ol className="ordered-list-items">
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.2.1.</span>
                  <p className="para-x">
                    the Foundation is not liable for loss of funds or damages
                    due to events outside its control or incorrect information
                    provided by you
                  </p>
                </li>
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.2.1.</span>
                  <p className="para-x">
                    The Foundation is not liable for loss of funds or damages
                    due to events outside its control or incorrect information
                    provided by you
                  </p>
                </li>
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.2.2.</span>
                  <p className="para-x">
                    you understand the risks involved in the Relevant Protocol's
                    development
                  </p>
                </li>
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.2.3.</span>
                  <p className="para-x">
                    you will receive the Tokens solely for your own benefit and
                    account, not for speculation or expectation of profit;
                  </p>
                </li>
              </ol>
            </div>
            <div className="subs">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">4.1.3.</span>
                <p className="para-x">NEAR Token Lock-Up and Vesting</p>
              </li>
              <ol className="ordered-list-items">
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.3.1.</span>
                  <p className="para-x">
                    NEAR Tokens used for the Grant may be subject to a linear
                    release Lock-Up, with technical restrictions on
                    transferability. Any such restrictions will be confirmed to
                    you ahead of any transfer of Tokens.
                  </p>
                </li>
              </ol>
            </div>
            <div className="subs">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">4.1.4.</span>
                <p className="para-x">Wallet Address</p>
              </li>
              <ol className="ordered-list-items">
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.4.1.</span>
                  <p className="para-x">
                    You are responsible for confirming the correct wallet
                    address(“<span className="h2">Wallet Address</span>”), which
                    must be accessible only through your private key. The
                    Foundation bears no responsibility for Token loss due to an
                    incorrect, inaccessible, or defective Wallet Address.
                  </p>
                </li>
              </ol>
            </div>
            <div className="subs">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">4.1.5.</span>
                <p className="para-x">Payment Suspension</p>
              </li>
              <ol className="ordered-list-items">
                <li className="ordered-list-item">
                  <span className="ordered-list-item-span">4.1.5.1.</span>
                  <p className="para-x">
                    The Foundation may suspend or withhold payments if the
                    project is not progressing satisfactorily or if you violate
                    these Terms.
                  </p>
                </li>
              </ol>
            </div>
          </ul>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">5.</span>Recipient Obligations
          </h4>
          <p className="para-x single-type">
            In exchange for the Grant, you undertake that you will:
          </p>
          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.1</span>
              <p className="para-x">
                Use the Grant solely for the Purpose and for no other purpose;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.2</span>
              <p className="para-x">
                Perform your obligations under these Terms:
              </p>
            </li>

            <ol className="ordered-list-items">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">5.2.1</span>
                <p className="para-x">In accordance with all Applicable Laws</p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">5.2.2</span>
                <p className="para-x">
                  Using reasonable skill, care and diligence; and
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">5.2.3</span>
                <p className="para-x">
                  In accordance with good industry practice as fitting for the
                  development and operation of the Purpose;
                </p>
              </li>
            </ol>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.3</span>
              <p className="para-x">
                use its best efforts to achieve the Purpose;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.4</span>
              <p className="para-x">
                ensure that any Software free of defects in all material
                respects and comply with all Applicable Laws and any and all
                specifications and requirements set by the Foundation;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.5</span>
              <p className="para-x">
                ensure that any underlying smart contract infrastructure is
                robustly audited and tested in accordance with best industry
                practice prior to its launch and, if and when appropriate, at
                regular intervals thereafter;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.6</span>
              <p className="para-x">
                on behalf of third parties/by way of a business have no power to
                invest any of the Grant amount. No interest or other income may
                be generated from the Grant;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.7</span>
              <p className="para-x">
                not materially alter the scope, features or direction (as
                applicable) of its business in relation to the Grant, without
                obtaining prior written approval from the Foundation;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.8</span>
              <p className="para-x">
                cooperate with the Foundation in all matters relating to the
                Purpose, and the Grant, and comply with the Foundation’s
                instructions;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.9</span>
              <p className="para-x">
                at all times conduct your business, and activities, in
                connection with these Terms in the best interest of, with good
                faith with respect to, and in such a manner to promote a good
                image of and enhance public relations for, the Foundation, the
                NEAR Technology, and the NEAR Ecosystem;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.10</span>
              <p className="para-x">
                not engage in any unfair or deceptive trade practice involving
                the Purpose, the Software, the Foundation, the NEAR Technology,
                the NEAR Token, or the NEAR Ecosystem;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.11</span>
              <p className="para-x">
                not make any false, misleading, negative, prejudicial, or
                disparaging representations or statements about the Foundation,
                the NEAR Technology, the NEAR Token and/or the NEAR Ecosystem
                (in connection with the Grant or otherwise);
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.12</span>
              <p className="para-x">
                will not become involved in or become associated with (whether
                directly or indirectly) any situation or activity (whether
                caused by you or a third party) which tends, in the reasonable
                opinion of the Foundation, to have a negative effect on the
                reputation or standing of the Foundation (or any aspect of its
                activities), the NEAR Technology, the NEAR Token, or the NEAR
                Ecosystem;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.13</span>
              <p className="para-x">
                where the Purpose involve software, you will provide to the
                Foundation t at a minimum read-only access to you’s private
                codebase, if requested by the Foundation;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.14</span>
              <p className="para-x">
                promptly notify the Foundation in writing if you are no longer
                actively pursuing the completion of the Purpose, and shall
                provide detailed reasons as part of such notification;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.15</span>
              <p className="para-x">
                promptly notify the Foundation in writing if you intend to
                deviate from the agreed specifications of the the Purpose and
                shall provide detailed reasons and proposed alternatives as part
                of such notification;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.16</span>
              <p className="para-x">
                regularly update the relevant Supervisor in writing (e.g. by
                email or via
                https://near.social/treasury-templar.near/widget/portal?page=proposals)
                on the progress of completion of the Purpose;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.17</span>
              <p className="para-x">
                Maintain clear and regular communication with the relevant
                Supervisor on the progress of achieving the Purpose s and
                provide timely and accurate information to the relevant
                Supervisor; and
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">5.18</span>
              <p className="para-x">
                promptly provide written notice to the Foundation of any claims,
                investigations or proceedings, which, if determined adversely,
                could reasonably be expected to result in a material adverse
                effect on the ability of you to achieve the Purpose or perform
                any of the other obligations under these Terms.
              </p>
            </li>
          </div>
          <li className="ordered-list-item">
            <p className="para-x">
              Failure to comply with these obligations may result in the
              suspension or termination of your access to the Grant, at the sole
              discretion of the Foundation.
            </p>
          </li>
        </div>

        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">6.</span>Review of Achievement by
            the Foundation
          </h4>
          <p className="para-x single-type">
            In exchange for the Grant, you undertake that you will:
          </p>

          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">6.1</span>
              <p className="para-x">
                The Foundation may conduct periodic reviews of the achievements
                by you in relation to the Grant provided under these Terms. The
                purpose of these reviews is to ensure that you are utilizing the
                Grant in accordance with the agreed terms and to assess the
                effectiveness of the Grant in achieving your objectives.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">6.2</span>
              <p className="para-x">
                The review process shall include, but not be limited to, an
                evaluation of your compliance with these Terms, the quality and
                impact of the Grant utilized, and any feedback from you
                regarding the Grant. The Foundation reserves the right to
                modify, suspend, or terminate the Grant provided to you based on
                the outcome of these reviews.
              </p>
            </li>
          </div>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">7.</span>
            Marketing and Promotion
          </h4>
          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">7.1</span>
              <p className="para-x">
                You will not make, issue or encourage and other person or entity
                to make or issue, any press releases or similar public statement
                or announcements (including, without limitation, via social
                media, podcast, webinar, interview, Telegram, an app or other
                publicly accessible medium) in connectio3n with the Grant,
                without the prior written approval of the Foundation (which will
                not be unreasonably withheld).
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">7.2</span>
              <p className="para-x">
                The Foundation may, but is not required to, make public any
                Grant under these Terms. Upon request by the Foundation, you
                will provide to the Foundation product descriptions, images,
                logos, website links and other content regarding the Grant as
                may be reasonably requested by the Foundation for inclusion in
                such publications.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">7.3</span>
              <p className="para-x">
                You agree to use best efforts to enable and procure the
                Foundation’s participation in co-branding and co-marketing
                opportunities with the goal of increasing the awareness and
                usage of the NEAR Technology.
              </p>
            </li>
          </div>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">8.</span>
            Representations and Warranties
          </h4>
          <p className="para-x"></p>

          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.1</span>
              <p className="para-x">You represent and warrant that</p>
            </li>
            <ol className="ordered-list-items">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.1.</span>
                <p className="para-x">
                  each of the following statements is true and accurate and all
                  of the information you provided was and shall remain true and
                  complete;
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.2.</span>
                <p className="para-x">
                  If you are applying for a Grant on behalf of a legal entity,
                  such legal entity is duly organized and validly existing under
                  the applicable laws of the jurisdiction of its organization
                  and you are duly authorized by such legal entity to act on its
                  behalf;
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.3.</span>
                <p className="para-x">
                  you are of legal age to form a binding contract (at least 18
                  years old in most jurisdictions);
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.4.</span>
                <p className="para-x">
                  you have the right, full power and authority to enter into
                  these Terms to exercise your rights and perform your
                  obligations under these Terms and in doing so will not violate
                  any other agreement to which you are a Party nor any laws;
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.5.</span>
                <p className="para-x">
                  these Terms constitutes a legal, valid and binding obligation
                  on you which are enforceable against you in accordance with
                  their terms;
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.6.</span>
                <p className="para-x">
                  no consent, authorization, license or approval of or notice to
                  any governmental authority nor your shareholders, partners,
                  members, other record or beneficial owners or other any
                  relevant person (as applicable) is required to authorize the
                  execution, delivery, validity, enforceability or admissibility
                  in evidence of the performance by You of your obligations
                  under these Terms;
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.7.</span>
                <p className="para-x">
                  you are not a citizen of, or resident in or located in, or
                  incorporated or otherwise a country:
                </p>
              </li>
            </ol>
            <ol className="ordered-list-items">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.7.1</span>
                <p className="para-x">
                  listed on any of the following lists (each a “
                  <span className="h2">“Sanctions List”</span>” ): the
                  Consolidated United Nations Security Council Sanctions List;
                  the Specially Designated Nationals and Blocked Persons List or
                  the Sectoral Sanctions Identification List maintained by the
                  US Office of Foreign Assets Control (OFAC); the Consolidated
                  List of Persons, Groups and Entities subject to EU Financial
                  Sanctions; the Consolidated List of Financial Sanctions
                  Targets or List of persons subject to restrictive measures in
                  view of Russia's actions destabilizing the situation in
                  Ukraine, maintained by the UK Treasury; the Overall List of
                  Sanctioned Individuals, Entities and Organizations maintained
                  by the Swiss State Secretariat for Economic Affairs (SECO);
                  'Ordinance lists of the Swiss Federal Council'; or any similar
                  list maintained by, or public announcement of sanctions made
                  by, any other Sanctions Authority (as defined below);
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.7.2</span>
                <p className="para-x">
                  owned or controlled by, or acting on behalf of or for the
                  benefit of, any person on a Sanctions List;
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.7.3</span>
                <p className="para-x">
                  located in, resident in or incorporated under the laws of (as
                  applicable) Syria, Iran, Cuba, Russia or North Korea, Crimea,
                  Donetsk and Luhansk, or any other country or territory which,
                  after the Effective Date, becomes the target of such
                  comprehensive, country-wide or territory-wide Sanctions (as
                  defined below) as currently apply to the aforementioned
                  territories; or
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">8.1.7.4</span>
                <p className="para-x">
                  the target of any sanctions laws, regulations, embargoes or
                  restrictive measures (Sanctions), as amended from time to
                  time, administered, enacted or enforced by: the United
                  Nations, the United States, the European Union or any Member
                  State thereof, the United Kingdom, Switzerland or the
                  respective Governmental Authorities and agencies of any of the
                  foregoing responsible for administering, enacting or enforcing
                  Sanctions, including without limitation, OFAC, the US
                  Department of State, the United Kingdom Treasury or the SECO
                  (Sanctions Authority).
                </p>
              </li>
            </ol>

            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.1.8.</span>
              <p className="para-x">
                the information that was submitted to the Foundation in
                connection with the Grant, and in any reports or communications
                delivered to the Foundation (including in respect of any Due
                Diligence), is accurate and complete;
              </p>
            </li>

            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.1.9.</span>
              <p className="para-x">
                your use of the Grant will comply with all applicable sanctions
                and the you will use best endeavors to prevent the use of any
                technology services provided by you and/or developed with the
                use of the Grant by sanctioned individuals and entities,
                including but not limited to the use of geo-blocking solutions.
              </p>
            </li>

            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.1.10.</span>
              <p className="para-x">
                any Software developed to achieve the Purpose will be free of
                material defects, bugs or vulnerabilities;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.1.11.</span>
              <p className="para-x">
                you will comply with any laws applicable to your Software and
                not engage in any illegal activities. In particular, you will
                not use the NEAR Protocol to facilitate infringement of any
                third party intellectual property rights or data privacy rights;
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.1.12.</span>
              <p className="para-x">
                no litigation, claim, arbitration, action, suit or
                administrative proceedings of any kind are taking place or
                pending, or to the best of your knowledge and belief (after due
                and careful enquiry), have been threatened against you; and
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.1.13.</span>
              <p className="para-x">
                you have the technical ability and resources necessary to
                fulfill its obligations under these Terms and, in particular, in
                connection with the Purpose.
              </p>
            </li>

            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.2</span>
              <p className="para-x">
                You shall indemnify and hold harmless the Foundation from any
                third party claims (including reasonable attorney's costs)
                raised against the Foundation based on an alleged infringement
                of the above representations and warranties.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.3</span>
              <p className="para-x">
                You are aware and confirm that the Foundation is relying on the
                above representations (which are material to the Foundation) and
                that if it were not for your representations and warranties in
                this Clause, the Foundation would not provide the Grant to you.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.4</span>
              <p className="para-x">
                The Foundation does not provide any warranty that the Software
                will be compatible with the NEAR Technology or any related
                technology now or in the future.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">8.5</span>
              <p className="para-x">
                The Foundation does not provide any warranty or representation
                (whether express or implied) of any kind in respect of the
                Grant, the Purpose or otherwise under or in connection with
                these Terms.
              </p>
            </li>
          </div>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">9.</span>
            Taxes and Other Duties
          </h4>

          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">9.1</span>
              <p className="para-x">
                You are solely responsible for determining what, if any, taxes
                or other duties apply to the Grant. It is also your
                responsibility to withhold, collect, report, and remit the
                correct taxes to the appropriate tax authorities, according to
                the legislation in force. The Foundation is not responsible and
                shall be in no way held liable for withholding, collecting,
                reporting, and remitting and taxes arising from, or in
                connection to the Grant.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">9.2</span>
              <p className="para-x">
                Neither party will have any right, power or authority to create
                any obligation, expressed or implied, on behalf of the other
                party in connection with these Terms.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">9.3</span>
              <p className="para-x">
                The Foundation makes no representation or warranty that you will
                profit in any way or derive any benefit from these Terms.
              </p>
            </li>
          </div>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">10.</span>
            Intellectual Property
          </h4>
          <p className="para-x"></p>

          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">10.1</span>
              <p className="para-x">
                Notwithstanding clause 10.2, you own all existing and future
                rights, titles and interests in and to the logos, trade names,
                strap lines, trademarks or service marks (registered or
                unregistered), accompanying artwork, designs, slogans, texts and
                other collateral marketing signs as made available by you which
                are not open-source, to the Foundation from time to time,
                including all associated Intellectual Property Rights ‘’(“
                <span className="h2">Recipient Marks</span>
                <i>”</i>). In relation to these Recipient Marks, you grant to
                the Foundation a non-exclusive, worldwide, royalty-free,
                sublicensable right and license to use, reproduce, distribute,
                display, publish and transmit the Recipient Marks solely in
                connection with this Agreement, the Purpose, and the
                Foundation’s business including, without limitation, for the
                advertisement, growth and promotion of the Foundation, the NEAR
                Technology and the NEAR Ecosystem, in any media formats, through
                any media channels or otherwise.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">10.2</span>
              <p className="para-x">
                Nothing in this Agreement will be construed as a representation
                or agreement that the Foundation will not develop or have
                developed products, concepts, systems or techniques that are
                similar to or compete with any products, concepts, systems or
                techniques contemplated by or embodied in any materials or
                information provided by you (including its team members) to the
                Foundation in connection with this Agreement and/or the Grant.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">10.3</span>
              <p className="para-x">
                The Foundation owns or has a license to use all existing and
                future rights, titles and interests in and to the logos, trade
                names, strap lines, trade or service marks (registered or
                unregistered), accompanying artwork, designs, slogans, texts and
                other collateral marketing signs of the Foundation or the NEAR
                Technology, including all associated Intellectual Property
                Rights (“<span className="h2">NEAR Marks</span>
                <i>”</i>). The Foundation grants to you the non-transferable and
                non-exclusive right to use the NEAR Marks as necessary for the
                purposes of this Agreement and until its termination, provided
                that you will strictly:
              </p>
            </li>
            <ol className="ordered-list-items">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">10.3.1.</span>
                <p className="para-x">
                  follow all brand guidelines provided by the Foundation,
                  including (without limitation), the guidelines found at
                  https://near.org/brand/. These guidelines may cover aspects
                  such as logo usage, color schemes, typography, and more; and
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">10.3.2.</span>
                <p className="para-x">
                  collaborate with the Foundation to coordinate the use of the
                  NEAR Marks in any promotional materials, events, or
                  activities. It is mandatory for you to obtain written approval
                  from the Foundation before using the NEAR Marks in any
                  capacity.
                </p>
              </li>
            </ol>
          </div>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">11.</span>
            Indemnification
          </h4>
          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">11.1</span>
              <p className="para-x">
                You will indemnify, defend and hold harmless the Foundation (and
                its directors, officers, employees, Affiliates, subsidiaries and
                agents) against any claims, actions proceedings, losses,
                damages, expenses and costs (including without limitation court
                costs and reasonable legal fees) arising out of or in connection
                with:
              </p>
            </li>
            <ol className="ordered-list-items">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">11.1.1.</span>
                <p className="para-x">
                  the making, acceptance or use of the Grant (and/or any other
                  benefit you receive under this Agreement);
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">11.1.2.</span>
                <p className="para-x">the pursuit by you of the Purpose</p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">11.1.3.</span>
                <p className="para-x">
                  any claim that the Purpose infringes the rights (including,
                  without limitation, Intellectual Property Rights) of any third
                  party; or
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">11.1.4.</span>
                <p className="para-x">
                  any breach by you of any provision of these Terms, provided
                  that you are given reasonably prompt notice of any such claim.
                </p>
              </li>
            </ol>
          </div>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">12.</span>
            Liability
          </h4>
          <p className="para-x single-type">
            You acknowledge and agree that, to the extent permissible by law,
            the Foundation will have no liability to you or any other NEAR
            Ecosystem participant for any liability howsoever arising (whether
            in tort (including for negligence) contract, misrepresentation
            (whether innocent or negligent), restitution or otherwise) in
            respect of the Purpose, the Software, the Grant, the NEAR
            Technology, or any action taken by the Foundation or you in
            connection with this Agreement.
          </p>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">13.</span>
            Suspected Misuse of the Grant
          </h4>

          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">13.1</span>
              <p className="para-x">
                Notwithstanding anything to the contrary elsewhere in these
                Terms, to the extent that the Foundation (acting reasonably) has
                a suspicion that some or all of the Grant is being used in a
                manner which (directly or indirectly) breaches any provision of
                these Terms, the Foundation will have the right to:
              </p>
            </li>
            <ol className="ordered-list-items">
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">13.1.1.</span>
                <p className="para-x">
                  on prior written notice to you, suspend the provision of any
                  further portions of the Grant (whether expressly due under
                  these Terms or otherwise) (a ‘’“
                  <span className="h2">Suspension Notice</span>
                  <i>”</i>”); and
                </p>
              </li>
              <li className="ordered-list-item">
                <span className="ordered-list-item-span">13.1.2.</span>
                <p className="para-x">
                  require that within five days from receipt of the suspension
                  notice, you provide all information and records which the
                  Foundation may reasonably require in order to determine the
                  deployment and use of the Grant by you (the “
                  <span className="h2">Grant Information</span>
                  <i>”</i>”).
                </p>
              </li>
            </ol>
          </div>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">14.</span>
            Changes to these Terms
          </h4>
          <p className="para-x single-type">
            We may revise and update these Terms from time to time in our sole
            discretion. All changes are effective immediately when we publish
            them and apply to all Proposals submitted thereafter. Your continued
            submission of Proposals following the posting of revised Terms means
            that you accept and agree to the changes.
          </p>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">15.</span>
            Governing Law and Jurisdiction
          </h4>
          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">15.1</span>
              <p className="para-x">
                All matters relating to these Terms, and any dispute or claim
                arising therefrom or related thereto (in each case, including
                non-contractual disputes or claims), shall be governed by and
                construed in accordance with the law of Cayman.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">15.2</span>
              <p className="para-x">
                Any legal suit, action, or proceeding arising out of, or related
                to these Terms shall be instituted exclusively in the courts of
                Zug, although we retain the right to bring any suit, action, or
                proceeding against you for breach of these Terms in your country
                of residence or any other relevant country.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">15.3</span>
              <p className="para-x">
                You waive any and all objections to the exercise of jurisdiction
                over you by such courts and to venue in such courts
              </p>
            </li>
          </div>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">16.</span>
            Limitation on Time to File Claims
          </h4>
          <p className="single-type1">
            ANY CAUSE OF ACTION OR CLAIM YOU MAY HAVE ARISING OUT OF OR RELATING
            TO THESE TERMS MUST BE COMMENCED WITHIN ONE (1) YEAR AFTER THE CAUSE
            OF ACTION ACCRUES, OTHERWISE, SUCH CAUSE OF ACTION OR CLAIM +IS
            PERMANENTLY BARRED.
          </p>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">17.</span>
            Waiver and Severability
          </h4>
          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">17.1</span>
              <p className="para-x">
                No waiver by us of any term or condition set out in these Terms
                shall be deemed a further or continuing waiver of such term or
                condition or a waiver of any other term or condition, and any
                failure of us to assert a right or provision under these Terms
                shall not constitute a waiver of such right or provision.
              </p>
            </li>
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">17.2</span>
              <p className="para-x">
                If any provision of these Terms is held by a court or other
                tribunal of competent jurisdiction to be invalid, illegal or
                unenforceable for any reason, such provision shall be eliminated
                or limited to the minimum extent such that the remaining
                provisions of the Terms will continue in full force and effect.
              </p>
            </li>
          </div>
        </div>
        <div className="list-item">
          <h4 className="list-item-title">
            <span className="list-item-number">18.</span>
            Entire Agreement
          </h4>
          <div className="subs">
            <li className="ordered-list-item">
              <span className="ordered-list-item-span">18.1</span>
              <p className="para-x">
                The Terms (including any terms expressly referred to herein, to
                the extent governing the relationship between you and the
                Foundation) constitute the sole and entire agreement between you
                and the Foundation regarding the Grant and supersede all prior
                and contemporaneous understandings, agreements, representations,
                and warranties, both written and oral, regarding the Grant.
              </p>
            </li>
          </div>
          <div className="list-item">
            <h4 className="list-item-title">
              <span className="list-item-number">19.</span>
              Contact
            </h4>
            <p className="para-x single-type">
              If you have any questions about these Terms please contact us via
              info@templarprotocol.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Container>
);
