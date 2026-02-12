import Link from "next/link";
import React from "react";

export const TC = () => {
	return (
		<>
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">Last update: January 2025</h3>
				<p className="text-sm text-body sm:text-lg">
					The following terms of service (these &quot;Terms of Service&quot;), govern your access to and use
					of the{" "}
					<Link href="https://pakt.build" target="_blank">
						www.pakt.build
					</Link>{" "}
					Chainsite and mobile webapp, including any content, functionality and services offered on or through
					www.pakt.build or the Pakt mobile application (the &quot;Chainsite&quot;) by Pakt World Inc. (1140
					N. Clark Street, West Hollywood, CA 90069, USA).{" "}
					<Link href="https://pakt.build" target="_blank">
						www.pakt.build
					</Link>{" "}
					is collectively referred hereto as &quot;Pakt&quot; &quot;we&quot; or &quot;us&quot; and
					&quot;you&quot; or &quot;user&quot; means you as a user of the Chainsite.
				</p>
				<p className="text-sm text-body sm:text-lg">
					Please read the Terms of Service carefully before you start to use the Chainsite.{" "}
					<span className="font-bold text-black">
						By using the Chainsite, opening an account or by clicking to accept or agree to the Terms of
						Service when this option is made available to you, you accept and agree, on behalf of yourself
						or on behalf of your employer or any other entity (if applicable), to be bound and abide by
						these Terms of Service, Pakt.build’s Payment Terms, found{" "}
						<Link href="https://www.fiverr.com/content/payments-terms-and-conditions" target="_blank">
							here
						</Link>{" "}
						(“Payment Terms”), Pakt’s Community Standards, found{" "}
						<Link href="https://www.fiverr.com/community/standards" target="_blank">
							here
						</Link>
						, and any additional standards, conditions, policies, guidelines and in-product disclosures
						(collectively, the “Terms”), which are incorporated herein by reference. You further acknowledge
						you have read and understood our Privacy Policy, found{" "}
						<Link href="https://www.fiverr.com/privacy-policy" target="_blank">
							here
						</Link>
						.
					</span>
				</p>
				<p className="text-sm text-body sm:text-lg">
					If you have any questions regarding the Chainsite or Terms please email{" "}
					<Link href="mailto:hello@pakt.world" target="_blank">
						hello@pakt.world.
					</Link>
				</p>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">
					1. Representations and Warranties
				</h3>
				<p className="text-sm text-body sm:text-lg">
					This Chainsite is offered and available to users who are of legal age to form a binding contract in
					the regions in which they reside. If you are not of legal age to form a binding contract in your
					region you are only permitted to use the Chainsite through an account owned by a parent or legal
					guardian with their appropriate permission.
				</p>
				<p className="text-sm text-body sm:text-lg">
					The Chainsite is available only to users who are not subject to any economic sanctions or trade
					restrictions imposed by the United States, European Union or any other applicable jurisdiction. By
					using the Chainsite, you represent and warrant that you meet all of the foregoing eligibility
					requirements. If you do not meet all of these requirements, you must not access or use the
					Chainsite.
				</p>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">2. Key Terms</h3>
				<p className="text-sm text-body sm:text-lg">
					<span className="font-bold text-black">Clients</span> are users who purchase services on the
					Chainsite
				</p>
				<p className="text-sm text-body sm:text-lg">
					<span className="font-bold text-black">Talents</span> are users who execute services on the
					Chainsite.
				</p>
				<p className="text-sm text-body sm:text-lg">
					<span className="font-bold text-black">Jobs</span> are single instances of services being rendered
					by Talent for Clients
				</p>
				<p className="text-sm text-body sm:text-lg">
					<span className="font-bold text-black">Global Smart Contract Tool</span> is the platform mechanism
					for Clients to create Jobs and smart contract them for services
				</p>
				<p className="text-sm text-body sm:text-lg">
					<span className="font-bold text-black">Non-Custodial Escrow Wallet</span> refers to a single-use
					blockchain wallet protected by Multi-Party Compute security that holds the tokenized payment for the
					Job. The funds cannot be accessed by Pakt.world Inc., nor Pakt.Build, nor Client, nor Talent, until:
					<ul className="list-decimal pl-8">
						<li className="text-sm text-body sm:text-lg">
							The Job is completed and both parties have reviewed each other’s performance
						</li>
						<li className="text-sm text-body sm:text-lg">
							A job cancellation has been requested and approved
						</li>
						<li className="text-sm text-body sm:text-lg">
							An Issue Resolution was requested and the jury issued their verdict
						</li>
					</ul>
				</p>
				<p className="text-sm text-body sm:text-lg">
					<span className="font-bold text-black">Wallet</span> is a page for users to access their funds and
					make withdrawals
				</p>
				<p className="text-sm text-body sm:text-lg">
					<span className="font-bold text-black">Profile</span> is where Talent post their bio, skills, and
					professional links. Additionally, the Talent Profile page presents reviews of the users’s past jobs
					as well as their Buildscore.
				</p>
				<p className="text-sm text-body sm:text-lg">
					<span className="font-bold text-black">Buildscore</span> is a reputation score that tracks users’
					past Chainsite performance, including reviews, number of 5-star jobs, number of referrals, and their
					referrals’ past Chainsite performance.
				</p>
				<p className="text-sm text-body sm:text-lg">
					<span className="font-bold text-black">Reviews</span> are counterparty performance evaluations
					ranked on a standard 5-star rating system, with 5 stars being the best and 1 star being the worst
				</p>
				<p className="text-sm text-body sm:text-lg">
					<span className="font-bold text-black">Issue Resolution</span> is a mechanism for adjudicating
					disputes between counterparties. A jury of 5 peers is chosen from the Chainsite and their decision
					is final and not open for appeal. Upon conclusion, the winning party receives all funds and the
					losing party receives a one-star review.
				</p>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">
					3. Overview (Main terms, in a nutshell)
				</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						Only registered users may buy and sell on the Chainsite. In registering for an account, you
						agree to provide accurate, complete and updated information regarding your business or personal
						details, and update such details as required, without undue delay. In addition, you must not
						create an account for fraudulent or misleading purposes. You are solely responsible for any
						activity on your account and for maintaining the confidentiality and security of your password.
						We are not liable for any acts or omissions by you in connection with your account.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Talent determines their pricing, at their sole discretion. Services on the Chainsite may be
						offered at a base starting price of US$10. Pakt reserves the right to set a higher base starting
						price in the future.
					</li>
					<li className="text-sm text-body sm:text-lg">
						After creating a Job with the Global Smart Contract Tool, Clients may search for Talent to hire
						or receive applications from Talent. Before inviting Talent to the Job, Clients must deposit Job
						payment funds in a Non-Custodial Escrow Wallet. This ensures the Talent that they are equal
						collaborators before commencing work.
					</li>
					<li className="text-sm text-body sm:text-lg">
						For fees and payments please read the{" "}
						<Link href="https://www.fiverr.com/content/payments-terms-and-conditions" target="_blank">
							Payment Terms.
						</Link>
					</li>
					<li className="text-sm text-body sm:text-lg">
						After the completion of the required work, Talent submits their work to the Client for review.
					</li>
					<li className="text-sm text-body sm:text-lg">
						After the Client reviews the Talent, the Talent reviews the Client.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Once both reviews are submitted, the Non-Custodial Escrow Wallet releases the funds into the
						Talent’s Wallet.
					</li>
					<li className="text-sm text-body sm:text-lg">
						If Client or Talent needs to cancel a Job they may request cancellation. Their counterparty then
						decides how much, if any, of the Job payment to take for themselves.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Furthermore, only the party who has received the cancellation request will be requested to leave
						a review.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Users’ profiles automatically update after the completion of each job, posting the latest review
						and updating their Buildscore based on the review.
					</li>
					<li className="text-sm text-body sm:text-lg">
						In instances where the parties arrive at irreconcilable differences, they may resolve their
						opposition through Issue Resolution. Issue resolution is not a recognized court of law; if
						further redress of grievances is deemed necessary by either counterparty they may exercise all
						legal rights available to them, but Pakt is waived of any legal accountability.
					</li>
					<li className="text-sm text-body sm:text-lg">
						When purchasing on the Chainsite, Clients are granted all rights for the delivered work, unless
						agreed otherwise between Talent and Client.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Pakt retains the right to use all Chainsite activity for marketing and promotion purposes.
					</li>
					<li className="text-sm text-body sm:text-lg">
						We care about your privacy. You can read our Privacy Policy here.
					</li>
					<li className="text-sm text-body sm:text-lg">
						The Chainsite is currently operating in an open beta. Its operators have conducted security
						audits and rigorous testing. However, you acknowledge that issues arising from technical
						difficulties may occur. Should an incident arise, The Chainsite operators will make every effort
						to restore full functionality for users in a timely manner. However neither the Chainsite
						operators nor Pakt.world are liable for any losses incurred.
					</li>
				</ul>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">4. Collaborations</h3>
				<div className="flex flex-col items-start gap-2 pl-4">
					{/*  */}
					<h3 className="text-center text-2xl font-bold text-black">4.1 Jobs</h3>
					<ul className="list-disc pl-8">
						<li className="text-sm text-body sm:text-lg">
							Jobs may be posted publicly or kept private. Public jobs appear on the Chainsite’s main feed
							as well as the Jobs page. Private jobs are not made visible and require the Client to
							personally invite desired talent.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Job Terms violations may include (but are not limited to) the following:
							<ul className="list-disc pl-2">
								<li className="text-sm text-body sm:text-lg">Illegal or fraudulent services</li>
								<li className="text-sm text-body sm:text-lg">
									Copyright Infringement, trademark infringement, and violation of a third
									party&apos;s terms of service{" "}
								</li>
								<li className="text-sm text-body sm:text-lg">Intentional copies of Jobs</li>
								<li className="text-sm text-body sm:text-lg">Jobs misleading to Clients or others</li>
								<li className="text-sm text-body sm:text-lg">Reselling of regulated goods</li>
								<li className="text-sm text-body sm:text-lg">
									Promoting Chainsite Jobs through activities that are prohibited by any laws,
									regulations and/or third-party terms of service, as well as through any marketing
									activity that negatively affects our relationships with users or partners
								</li>
							</ul>
						</li>
						<li className="text-sm text-body sm:text-lg">
							The Chainsite reserves the right to remove Jobs or Clients who violate the above policies
						</li>
						<li className="text-sm text-body sm:text-lg">
							Jobs that have been permanently removed for violations are not eligible to be restored or
							edited
						</li>
						<li className="text-sm text-body sm:text-lg">
							Jobs may be removed from our listings due to violations of our Terms, poor performance,
							and/or user misconduct.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Jobs may include Chainsite URLs to pre-approved URL patterns contained within the Job
							description and requirements box. Jobs containing Chainsites promoting content, which
							violates these enumerated Terms, can be removed.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Jobs are required to have a description and executables related to the services desired.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Jobs may contain approved supplemental materials uploaded through the Chainsite’s messaging
							function or other mechanisms such as email, Telegram, or work management tools. The use of
							supplemental materials must be mentioned in the job description in order for the talent to
							be responsible for incorporating their information into the execution of their work.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Jobs created on the Chainsite are User Generated Content.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Users are responsible for scanning all transferred files for viruses and malware. Both the
							Chainsite and Pakt will not be held responsible for any damages which might occur due to
							Chainsite usage, use of content or files transferred.
						</li>
						<li className="text-sm text-body sm:text-lg">
							The Chainsite does not provide any guarantee of the level of service offered by Talent to
							Clients nor of the competency of Clients to Talent. Reviews, Job Cancellation, and Issue
							Resolution exist to refine the discovery process of quality Clients and Talent to increase
							the odds of well-matched collaborators.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Users with the intention to defame competing Talent or Clients by creating Job posts without
							the intention to hire for services will be subject to disciplinary action and/or removal.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Statements on Job descriptions that undermine or circumvent these Terms are prohibited and
							are null and void.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Clients and Talent warrant that any content included in their Chainsite activity is original
							work or concepts conceived by the user and does not infringe any third-party rights,
							including, without limitation, copyrights, trademarks or service marks.
						</li>
						<li className="text-sm text-body sm:text-lg">
							In the event that certain music or stock-footage media are incorporated within the Job, Job
							Page or Profile Page, users represent and warrant that they hold a valid license to use such
							music and/or footage and to include them in their activity.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Users acknowledge that the exchange of confidential, proprietary, or otherwise sensitive
							information may be required for delivering the Services. They agree to protect such
							confidential information from unauthorized use and disclosure. Both parties agree to treat
							information received as highly sensitive, top secret and classified. Without derogating from
							the generality of the above, users specifically agree to (i) maintain all such information
							in strict confidence; (ii) not disclose the information to any third parties; (iii) not use
							the information for any purpose except for delivering the Services; and (vi) not to copy or
							reproduce any of the information without the expressed written permission of their
							counterparty.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Any Job activity that may violate the Chainsite’s Terms based on the reported Job’s
							replicated similarity to pre-existing services (copycat Jobs) is subject to discipline to be
							determined as the platform grows.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Users will respond to clear and complete notices of alleged copyright or trademark
							infringement. Neither the Chainsite nor Pakt is responsible for any IP violations.
						</li>
					</ul>
					{/*  */}
					<h3 className="text-center text-2xl font-bold text-black">4.2 Talent</h3>
					<ul className="list-disc pl-8">
						<li className="text-sm text-body sm:text-lg">
							Talent creates Profiles on the Chainsite to advertise their services to Clients
						</li>
						<li className="text-sm text-body sm:text-lg">
							Talent can apply for open jobs posted on the platform and suggest a different price than the
							price proposed by the Client.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Talent can request the Client make changes to the job description before the funding of the
							job.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Once an invite to a Job has been accepted, Talent is responsible for the full delivery of
							the services detailed in the Client’s job description.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Talent can refer other talent to the platform. When referrals complete a 5-star job the
							referring Talent receives a point on their Buildscore. Talent can earn up to 10 points in
							total through referrals.
						</li>
						<li className="text-sm text-body sm:text-lg">
							As Talent marks off deliverable milestones, it will populate the Client’s timeline with
							notifications alerting them to the progress towards Job completion.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Upon completion of all deliverables, Talent submits the Job to the Client for review.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Talent are required to meet the delivery time specified by the Job posting. Failing to do so
							may result in the Client leaving a poor review.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Talent must send all specified deliverables when marking the Job as Completed.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Should Talent submit services as completed when they are not is likely to result in a low
							review from the Client and is inadvisable as it will reduce the likelihood of being selected
							for future employment.
						</li>
						<li className="text-sm text-body sm:text-lg">
							If the Talent receives a review below 5 stars they can request approval from the client to
							redo and resubmit the work.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Each Job completed and reviewed by both parties will deposit the funds held in the
							Non-Custodial Escrow Wallet into the Talent’s Wallet.
						</li>
						<li className="text-sm text-body sm:text-lg">
							All applicable Taxes are the responsibility of the Talent within whichever region they
							reside.
						</li>
						<li className="text-sm text-body sm:text-lg">
							The total funds received will be the total funds deposited into the Non-Custodial Escrow
							Wallet, minus any Chainsite fee and Pakt’s standard 1% Trusted Execution fee.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Talents are welcome and encouraged to promote their services through whatever legal means
							they deem appropriate.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Talents are responsible for obtaining any required insurance, permits, or other legal
							policies to execute the performance of their services.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Prior to participating in a job, users are required to complete KYC/AML conducted by Veriff.
							Neither the Chainsite nor Pakt will retain your documentation information. Pakt only retains
							your approval or rejection confirmation from Veriff.
						</li>
					</ul>
					{/*  */}
					<h3 className="text-center text-2xl font-bold text-black">4.3 Clients</h3>
					<ul className="list-disc pl-8">
						<li className="text-sm text-body sm:text-lg">
							Clients are fully responsible for the accuracy of the description of the services they
							desire for their Job created with the Global Smart Contract Tool. Talents are only
							responsible for delivering the services defined in the job description.{" "}
						</li>
						<li className="text-sm text-body sm:text-lg">
							Clients may change the terms of their Job proposal until they make the deposit into the
							Non-Custodial Escrow Wallet prior to inviting the Talent. Once funds have been deposited the
							terms of the Job are set.
						</li>
						<li className="text-sm text-body sm:text-lg">Clients may post jobs publicly or privately. </li>
						<li className="text-sm text-body sm:text-lg">
							Clients are responsible for reviewing the Talent. Clients who do not review Talent are
							breaking the business flow of the Chainsite and in essence, withholding funds.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Clients may request Talent to redo services or deliverables if the work does not satisfy
							their standards. However, they should bear in mind that Talent will review them at the
							completion of the job as well. Clients with low Buildscores and poor reviews will likely be
							avoided by top Talent.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Clients may not offer direct payments to Talent using payment systems outside of the
							Chainsite platform.
						</li>
						<li className="text-sm text-body sm:text-lg">
							When funding a Job on the Chainsite, Clients may only use funds that were obtained from
							legal sources and are not, directly or indirectly, connected to any unlawful or fraudulent
							activities.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Clients using the Chainsite for purposes other than hiring Talent for services are subject
							to removal and any appropriate legal action.{" "}
						</li>
					</ul>
					{/*  */}
					<h3 className="text-center text-2xl font-bold text-black">4.4 Shipping Physical Deliverables</h3>
					<ul className="list-disc pl-8">
						<li className="text-sm text-body sm:text-lg">
							If a Job requires the physical delivery of one or more items Client and Talent are
							encouraged to include a shipping pricing factor in their negotiations before finalizing the
							executables of a Job. The following must apply in case the Client and Talent agree on
							Shipping Physical Deliverables
						</li>
						<li className="text-sm text-body sm:text-lg">
							Jobs that include a shipping pricing factor must have physical deliverables sent to Clients.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Important: Clients who purchase Jobs that require physical delivery will be asked to provide
							a shipping address.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Talents are responsible for all shipping arrangements once the Client provides the shipping
							address.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Neither the Chainsite nor Pakt handles nor guarantees shipping, tracking, quality, and
							condition of items or their delivery and shall not be responsible or liable for any damages
							or other problems resulting from shipping.
						</li>
						<li className="text-sm text-body sm:text-lg">
							A tracking number is a great way to avoid disputes related to shipping. We encourage sharing
							a tracking number via messaging when delivering physical work.
						</li>
					</ul>
					{/*  */}
					<h3 className="text-center text-2xl font-bold text-black">4.5 In-Person Services</h3>
					<ul className="list-disc pl-8">
						<li className="text-sm text-body sm:text-lg">
							If a Job requires in-person engagement between Clients and Talent both parties are solely
							responsible for their actions.
						</li>
						<li className="text-sm text-body sm:text-lg">
							In such cases, users should note that neither the Chainsite nor Pakt guarantees the
							behavior, conduct, safety, suitability or ability of either Clients or Talent.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Both Clients and Talent agree that the entire risk arising out of their meeting and/or their
							use or performance of local services remains solely with them, and neither the Chainsite nor
							Pakt bears any responsibility or liability related to any local services provided by the
							Talent or actions taken by the Client.
						</li>
						<li className="text-sm text-body sm:text-lg">
							In the event that the service is performed on the Clients’ premises, Clients are encouraged
							to maintain proper insurance policies to cover their liability as the premise owner.
						</li>
						<li className="text-sm text-body sm:text-lg">
							The Chainsite and Pakt’s Terms remain applicable to Jobs that are performed outside of the
							marketplace (including, among others, any restrictions on Unlawful Use, Inappropriate
							Behavior & Language, and Targeted Abuse.
						</li>
					</ul>
					{/*  */}
					<h3 className="text-center text-2xl font-bold text-black">4.6 Reviews</h3>
					<ul className="list-disc pl-8">
						<li className="text-sm text-body sm:text-lg">
							Reviews provided by Clients are an essential part of the Chainsite rating system. To learn
							more about Pakt’s review system, please see{" "}
							<Link
								href="https://docs.google.com/document/d/e/2PACX-1vRlDnU6pqhaoqyx8y9_HweuUTZ34kkqIuWbGXrax4hzxsAE9SwxGXFs-cKTUReXygw_prJKGjNQwynO/pub"
								target="_blank"
							>
								here.
							</Link>
						</li>
						<li className="text-sm text-body sm:text-lg">
							Reviews will not be removed unless there are clear violations of our Terms.
						</li>
						<li className="text-sm text-body sm:text-lg">
							To prevent any misuse of our review system, all reviews must come from legitimate and
							eligible orders. Purchases arranged, determined to artificially enhance ratings, or to abuse
							the Chainsite, may result in a permanent suspension of all related accounts.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Furthermore, spamming of the review system with false jobs may result in third parties on
							the platform “policing” the ecosystem by taking you to an Issue Resolution. If the parties
							are found guilty, both will receive a 1-star review and the funds will be sent to the party
							that raised the Issue Resolution.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Withholding the delivery of services, files, or information required to complete the Job’s
							service with the intent to gain favorable reviews or additional services is prohibited.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Talent may not solicit the removal of feedback reviews from their Clients through mutual
							cancellations.
						</li>
						<li className="text-sm text-body sm:text-lg">
							Once both Client and Talent have completed their reviews the reviews are posted publicly on
							the counterparties&apos; bio page.
						</li>
					</ul>
				</div>
			</div>
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">
					5. User Conduct and Protection
				</h3>
				<p className="text-sm text-body sm:text-lg">
					The Chainsite enables users around the world to create, share, sell and purchase nearly any service
					they need. It is superior to Web2 work platforms because of its blockchain integration ensuring both
					Clients and Talents have “skin in the game” to elevate the likelihood of a positive and constructive
					collaboration.
				</p>
				<p className="text-sm text-body sm:text-lg">
					The Chainsite maintains a friendly, community-spirited, and professional environment. Users should
					keep to that spirit while participating in any activity or extension of the Chainsite. This section
					relates to the expected conduct users should adhere to while interacting with each other on the
					Chainsite.
				</p>
				{/*  */}
				<h3 className="text-center text-2xl font-bold text-black">5.1 Basics</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						Any necessary exchange of personal information required to continue a service may be exchanged.
						Requesting or providing email addresses, third-party messaging applications, telephone numbers
						or any other personal contact details to communicate outside of the Chainsite is allowed.
					</li>
					<li className="text-sm text-body sm:text-lg">
						However, users should note that the Chainsite is built to protect their interests. Once they
						have moved communications beyond the Chainsite they have relinquished the security
						considerations the Chainsite has put in place for their benefit.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Neither the Chainsite nor Pakt does not protect users who interact outside of the Chainsite.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Rude, abusive, or improper language and violent or threatening messages will not be tolerated.
					</li>
					<li className="text-sm text-body sm:text-lg">
						You undertake not to discriminate against any other user based on gender, race, age, religious
						affiliation, sexual orientation or otherwise and you acknowledge that such discrimination may
						result in the suspension/removal of your account.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Users may not submit proposals or solicit parties introduced through the Chainsite to contract,
						engage with, or pay outside of the Chainsite.
					</li>
				</ul>
				{/*  */}
				<h3 className="text-center text-2xl font-bold text-black">5.2 Non-Permitted Usage</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						Inappropriate Behavior & Language - Communication on the Chainsite should be constructive, and
						professional. The Chainsite condemns bullying, harassment, and hate speech towards others. We
						allow users a medium for which messages are exchanged between individuals, a system to rate
						orders, a cancellation flow, and an Issue Resolution flow.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Phishing and Spam - Members’ security is a top priority. Any attempts to publish or send
						malicious content with the intent to compromise another member’s account or computer environment
						are strictly prohibited.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Privacy & Identity - You may not publish or post other people&apos;s private and confidential
						information. Any exchange of personal information required for the completion of a service is to
						be treated as confidential. Users further confirm that whatever information they receive from
						counterparties which is not public domain shall not be used for any purpose whatsoever other
						than for the delivery of the work to the Client. Any users who engage and communicate off of the
						Chainsite will not be protected by our Terms of Service.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Authentic Profile - Users are not required to post their legal names or human faces on their
						profile. They are encouraged to express themselves however they desire, including the use of
						nicknames, avatar profile pictures, and other biographical flourishes. However, Users may not
						intentionally misrepresent their identity, create a Chainsite profile for any human other than
						themselves (unless it is a legal guardian creating a profile for their ward), or use or attempt
						to use another user’s account or information; Your profile’s “Real World” information, including
						your location and email must be accurate and complete and may not be misleading, illegal,
						offensive or otherwise harmful. Users’ profiles are authenticated via KYC conducted by
						Veriff.{" "}
					</li>
					<li className="text-sm text-body sm:text-lg">
						Intellectual Property Claims - Users are solely responsible for addressing and resolving any
						issues of alleged copyright or trademark infringement, and/or violation of third party’s terms
						of service.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Fraud / Unlawful Use - You may not use the Chainsite for any unlawful purposes or to conduct
						illegal activities, including to bypass economic sanctions or trade restrictions imposed by the
						United States, European Union or any other applicable jurisdiction.
					</li>
					<h3 className="text-center text-2xl font-bold text-black">Abuse and Spam</h3>
					<li className="text-sm text-body sm:text-lg">
						Multiple Accounts - To prevent fraud and abuse, users are limited to one active Chainsite
						account per email. Any additional account determined to be created to circumvent guidelines,
						promote competitive advantages, or mislead the Chainsite community may be disabled. Mass account
						creation for non-business purposes may result in the disabling of all related accounts. Note:
						any violations of the Terms may be a cause for permanent suspension of all accounts.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Targeted Abuse - We do not tolerate users who engage in targeted abuse or harassment towards
						other users on the Chainsite. This includes creating new multiple accounts to harass members
						through our message or Job creation system
					</li>
				</ul>
				{/*  */}
				<h3 className="text-center text-2xl font-bold text-black">5.3 Reporting Violations</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						If you come across any content that may violate our Terms and/or our Community Standards, you
						should report it to{" "}
						<Link href="" target="_blank">
							hello@pakt.world
						</Link>
						. Our decisions and actions, among others, may rely on the information that you provided to us.
					</li>
					<li className="text-sm text-body sm:text-lg">
						In the future, Issue Resolution may be expanded to empower Chainsite users to take perceived bad
						actors to adjudication. The results of such adjudication may include but are not limited to
						financial and reputational repercussions.
					</li>
					<li className="text-sm text-body sm:text-lg">
						To protect individual privacy, the results of the investigation are not shared. You can review
						our Privacy Policy for more information. Any misuse of our reporting system may result in a
						restriction or a permanent suspension of the related accounts.
					</li>
				</ul>
				{/*  */}
				<h3 className="text-center text-2xl font-bold text-black">5.4 Violations</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						Users may receive a warning to their account for violations of our Terms. A warning will be sent
						to the user&apos;s email address. Warnings may result in removal from the Chainsite or other
						disciplinary actions to be built and applied.
					</li>
					<li className="text-sm text-body sm:text-lg">
						If the Chainsite takes action against a user’s account for the violation of our Terms we will
						send the user an email explaining the reasons and basis for such actions.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Users hereby waive both the Chainsite and Pakt for any damages resulting from their violation of
						the Terms.
					</li>
				</ul>
				{/*  */}
				<h3 className="text-center text-2xl font-bold text-black">
					5.5 Content Moderation, Notices and Appeals
				</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						Neither the Chainsite nor Pakt is obligated to proactively check the content posted by users for
						its legality or compatibility with the Terms. We are nonetheless entitled to carry out voluntary
						checks on our initiative to identify and determine illegal or incompatible content and to take
						appropriate measures. We may take appropriate actions if we find or are notified of, a violation
						of the Terms.
					</li>
					<li className="text-sm text-body sm:text-lg">
						If an action is taken concerning you, your account or content, you can file a complaint against
						this decision at{" "}
						<Link href="" target="_blank">
							hello@pakt.world
						</Link>
						. In both cases, the deadline for submitting a complaint is two weeks following the notification
						of the respective decision to you. You may file a complaint by contacting our Customer Support.
						Please explain in your complaint why you believe we should reverse our decision.
					</li>
					<li className="text-sm text-body sm:text-lg">
						We will handle complaints in a timely, non-discriminatory, diligent, and objective manner and
						will reverse our decision if we conclude that it has been taken erroneously.
					</li>
					<li className="text-sm text-body sm:text-lg">
						If you have your place of establishment or are located in the European Economic Area (EEA), you
						may select an out-of-court dispute settlement body that has been certified under Art. 21 (3) of
						the EU Digital Services Act (“Dispute Settlement Body”) to resolve disputes relating to our
						decisions concerning content you uploaded or notices you submitted, including complaints that
						our internal complaint-handling system did not resolve.
					</li>
					<li className="text-sm text-body sm:text-lg">
						We reserve the right to refuse to cooperate with the selected Dispute Settlement Body if: (i)
						the respective dispute has already been resolved or is already subject to an ongoing procedure
						before the competent court or before another competent Dispute Settlement Body; or (ii) the six
						months from notification of our decision to you has expired without you filing a complaint
						through our internal complaint-handling or addressing the Dispute Settlement Body.
					</li>
					<li className="text-sm text-body sm:text-lg">
						The decisions of Dispute Settlement Bodies are not binding on either party.
					</li>
				</ul>
				{/*  */}
				<h3 className="text-center text-2xl font-bold text-black">5.6 Disputes and Cancellations</h3>
				<p className="text-sm text-body sm:text-lg">
					We encourage our Clients and Talent to try and settle conflicts amongst themselves. If for any
					reason this fails or if you encounter non-permitted usage on the Chainsite outside the parameters
					previously identified please contact hello@pakt.world
				</p>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">6. Ownership and Rights</h3>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">
					6.1 Chainsite UI, UX, Naming, and Ownership
				</h3>
				<p className="text-sm text-body sm:text-lg">
					The Chainsite, including its general layout, look and feel, design, information, content and other
					materials available thereon, is exclusively owned by Pakt and protected by copyright, trademark, and
					other intellectual property laws. Users have no right, and specifically agree not to do the
					following with respect to the Chainsite or any part, component or extension of the Chainsite
					(including its mobile applications): (i) copy, transfer, adapt, modify, distribute, transmit,
					display, create derivative works, publish or reproduce it, in any manner; (ii) reverse assemble,
					decompile, reverse engineer or otherwise attempt to derive its source code, underlying ideas,
					algorithms, structure or organization; (iii) remove any copyright notice, identification or any
					other proprietary notices; (iv) use automation software (bots), hacks, modifications (mods) or any
					other unauthorized third-party software designed to modify the Chainsite; (v) attempt to gain
					unauthorized access to, interfere with, damage or disrupt the Chainsite or the computer systems or
					networks connected to the Chainsite; (vi) circumvent, remove, alter, deactivate, degrade or thwart
					any technological measure or content protections of the Chainsite; (vii) use any robot, spider,
					crawlers or other automatic device, process, software or queries that intercepts, “mines,” scrapes
					or otherwise accesses the Chainsite to monitor, extract, copy or collect information or data from or
					through the Chainsite, or engage in any manual process to do the same, (viii) introduce any viruses,
					trojan horses, worms, logic bombs or other materials that are malicious or technologically harmful
					into our systems, (ix) use the Chainsite in any manner that could damage, disable, overburden or
					impair the Chainsite, or interfere with any other users’ enjoyment of the Chainsite or (x) access or
					use the Chainsite in any way not expressly permitted by the Terms. Users also agree not to permit or
					authorize anyone else to do any of the foregoing.
				</p>
				<p className="text-sm text-body sm:text-lg">
					Except for the limited right to use the Chainsite according to these Terms of Service, Pakt owns all
					rights, titles and interests in and to the Chainsite (including any intellectual property rights
					therein) and you agree not to take any action(s) inconsistent with such ownership interests. We
					reserve all rights in connection with the Chainsite and its content (other than UGC) including,
					without limitation, the exclusive right to create derivative works.
				</p>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">6.2 Chainsite Template</h3>
				<p className="text-sm text-body sm:text-lg">
					The Chainsite is built upon a UI template created by Pakt for usage with its proprietary Blockchain
					Business Stack. The template can be used by entities who launch their own Chainsite via Pakt’s
					Command Center, customized, and repurposed for other business purposes. Usage of this template does
					not grant any exclusivity rights to the look, feel, or functionality provided by the Chainsite
					template.
				</p>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">6.3 Feedback Rights</h3>
				<p className="text-sm text-body sm:text-lg">
					To the extent that you provide Pakt with any comments, suggestions or other feedback regarding the
					Chainsite, as well as other Pakt products or services (collective, the “Feedback”), you will be
					deemed to have granted Pakt an exclusive, royalty-free, fully paid up, perpetual, irrevocable,
					worldwide ownership rights in the Feedback. Pakt is under no obligation to implement any Feedback it
					may receive from users.
				</p>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">
					6.4 Job Deliverables Ownership and Limitations
				</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						When purchasing a Service on the Chainsite, unless clearly stated otherwise on the Talent’s when
						the work is delivered, and subject to payment, the Client is granted all intellectual property
						rights, including but not limited to, copyright in the work delivered from the Talent, and the
						Talent waives any moral rights (to the extent permitted by applicable law) therein. Accordingly,
						the Talent expressly assigns to the Client the copyright in the delivered work.
					</li>
					<li className="text-sm text-body sm:text-lg">
						All transfer and assignment of intellectual property to the Client shall be subject to full
						payment, and the delivery may not be used if payment is cancelled for any reason. For removal of
						doubt, in custom-created work (such as artwork, design work, code generation etc.), the
						delivered work and its copyright shall be the exclusive property of the Client and, upon
						delivery, the Talent agrees that it thereby, under the Terms, assigns all right, title and
						interest in and to the delivered work to the Client.
					</li>
					<li className="text-sm text-body sm:text-lg">
						For Voice Over Jobs, when the work is delivered, and subject to payment, the Client is
						purchasing basic rights (which means the Client is paying a one-time fee allowing them to use
						the work forever and for non-commercial purposes), Commercial Rights Buy-Out (usage of Voice
						Over to promote a product and/or service), and a Full Broadcast Rights Buy-Out (for use in
						radio, television and internet commercials. Talents are responsible for agreeing to a price that
						satisfies their desire for fair compensation for all potential usage.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Furthermore, users (both Clients and Talent) agree that unless they explicitly indicate
						otherwise, the content they voluntarily create/upload to the Chainsite, including Job texts,
						photos, videos, usernames, user photos, user videos and any other information, including the
						display of delivered work, may be used by Chainsite for no consideration for marketing purposes
						and/or other purpose relevant for the operation and function of the Chainsite.
					</li>
				</ul>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">7. User Generated Content</h3>
				<p className="text-sm text-body sm:text-lg">
					User Generated Content (&quot;UGC&quot;) refers to the content uploaded by users as opposed to
					content created by the Chainsite. All content uploaded to the Chainsite by our users (Clients and
					Talent) is User Generated Content. The Chainsite does not proactively check UGC for appropriateness,
					violations of copyright, trademarks, or other rights or violations and the user uploading/creating
					such content shall be solely responsible for it and the consequences of using, disclosing, storing,
					or transmitting it. By uploading to, or creating content on, the Chainsite, you represent and
					warrant that you own or have obtained all rights, licenses, consents, permissions, power and/or
					authority, necessary to use and/or upload such content and that such content or the use thereof in
					the Chainsite does not and shall not (a) infringe or violate any intellectual property, proprietary
					or privacy, data protection or publicity rights of any third party; (b) violate any applicable
					local, state, federal and international laws, regulations and conventions; and/or (c) violate any of
					your or third party’s policies and/or terms of service. We invite everyone to report violations
					together with proof of ownership as appropriate. Violating content may be removed or disabled.
				</p>
				<p className="text-sm text-body sm:text-lg">
					By contracting or offering a Job, users pledge that they have sufficient permissions, rights and/or
					licenses to provide, sell or resell the service that is offered on the Chainsite. Talent advertising
					online their Services, including Jobs, Profiles, or other Chainsite components must comply with laws
					and terms of service of the advertising platform or relevant Chainsite used to advertise.
				</p>
				<p className="text-sm text-body sm:text-lg">
					For specific terms related to Intellectual Property rights and for reporting claims of copyright
					infringement or trademark infringement - please see our Intellectual Property Claims Policy which
					forms an integral part of the Terms. Note that it is our policy in appropriate circumstances to
					disable and/or terminate the accounts of users who are repeat infringers.
				</p>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">
					8. Disclaimer of Warranties
				</h3>
				<p className="text-sm text-body sm:text-lg">
					YOUR USE OF THE CHAINSITE, ITS CONTENT AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE CHAINSITE IS
					AT YOUR OWN RISK. THE CHAINSITE, ITS CONTENT AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE
					CHAINSITE ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT ANY
					WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, PROVIDED THAT WE HAVE ACTED WITH REASONABLE
					PROFESSIONAL DILIGENCE. NEITHER THE CHAINSITE NOR PAKT NOR ANY PERSON ASSOCIATED WITH EITHER MAKES
					ANY WARRANTY OR REPRESENTATION CONCERNING THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY
					OR AVAILABILITY OF THE CHAINSITE. THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CAN BE EXCLUDED
					OR LIMITED UNDER APPLICABLE LAW.
				</p>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">
					9. AI and Browser Activities
				</h3>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-2xl">9.1 AI</h3>
				<p className="text-sm text-body sm:text-lg">
					Certain content and experiences on the Chainsite may include interaction or engagement with AI
					entities. Reasonable efforts have been undertaken to ensure the safety of all users, their
					information, and their privacy. However, AI is an emergent technology with unprecedented
					capabilities. As such, any usage of or engagement with an AI is provided to users of the Chainsite
					&quot;as is&quot;. No warranty of any kind, either expressed or implied, is made as to the accuracy,
					reliability, or correctness of statements, actions, or collaborations involving AI. The Chainsite
					and Pakt disclaim all warranties related to any AI activities including any warranties of accuracy,
					reliability, and any implied warranties of merchantability, fitness for a particular purpose and
					noninfringement.
				</p>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-2xl">9.2 Language Translations</h3>
				<p className="text-sm text-body sm:text-lg">
					The official text is the English version of the Chainsite. Any discrepancies or differences created
					in any translations are not binding and have no legal effect for compliance or enforcement purposes.
					If any questions arise related to the accuracy of the information contained in the translated
					content, please refer to the English version of the content which is the official version.
				</p>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">10. USER DATA</h3>
				<p className="text-sm text-body sm:text-lg">
					PROVIDED THAT WE (the Chainsite and Pakt) HAVE ACTED WITH REASONABLE PROFESSIONAL DILIGENCE, IN NO
					EVENT WILL WE, OUR AFFILIATES OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS OR
					DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION
					WITH YOUR USE, OR INABILITY TO USE, THE CHAINSITE, ANY WEBSITES OR CHAINSITES LINKED TO IT, ANY
					CONTENT ON THE CHAINSITE OR SUCH OTHER WEBSITES OR CHAINSITES OR ANY SERVICES OR ITEMS OBTAINED
					THROUGH THE CHAINSITE OR SUCH OTHER WEBSITES OR CHAINSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL,
					INCIDENTAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN
					AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED
					SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING
					NEGLIGENCE), BREACH OF CONTRACT OR OTHERWISE, EVEN IF FORESEEABLE.
					<br />
					THE FOREGOING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE
					LAW.
				</p>
				<p className="text-sm text-body sm:text-lg">
					The term “Affiliate” referred to herein, is an entity that, directly or indirectly, controls, or is
					under the control of, or is under common control with the Chainsite or Pakt, where control means
					having more than twenty-five per cent (25%) voting stock or other ownership interest or the majority
					of voting rights of such entity.
				</p>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">
					11. Deactivate and Disable Account
				</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						The Chainsite reserves the right to put any account on hold or permanently disable accounts due
						to a breach of the Terms, including low-quality services or deliveries, or due to any illegal or
						inappropriate use of the Chainsite or services.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Violation of the Chainsite’s Terms may get your account permanently disabled.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Users with disabled accounts will not be able to sell or buy on the Chainsite and related
						content may be removed. Please refer to the Terms, in particular the Content Moderation, Notices
						and Appeals section, for your rights to object to our decisions, or contact our Customer Support
						team for more information surrounding the violation and status of your account.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Users may also deactivate their account on the Chainsite at any time from their account
						settings. Users who deactivate their accounts must withdraw all funds and complete all jobs
						before deactivation.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Any provisions of the Terms that relate to the relation between a Talent and a Client regarding
						Jobs on the Chainsite will remain in effect even after you deactivate your account, or after
						your access to the Chainsites is disabled.
					</li>
				</ul>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">12. Security Features</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						Users have the option to enable account Security features to protect their account from any
						unauthorized usage.
					</li>
					<li className="text-sm text-body sm:text-lg">
						These include Password Reset and Two-Factor Authentication.
					</li>
					<li className="text-sm text-body sm:text-lg">
						Two-factor authentication can be performed either using a third-party Authenticator application
						or an email approach.
					</li>
				</ul>
			</div>
			{/*  */}
			<div className="flex flex-col items-start gap-2">
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">13. General Terms</h3>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">
					13.1 Changes to these Terms
				</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						The Chaniste may make changes to these Terms from time to time. When these changes are made, the
						Chainsite will make a new copy of the Terms available on the respective page.
					</li>
					<li className="text-sm text-body sm:text-lg">
						You understand and agree that if you use the Chainsite after the date on which the Terms have
						changed, Pakt will treat your use as acceptance of the updated Terms. If you do not agree to the
						changes in the Terms, you will have to deactivate your account.
					</li>
					<li className="text-sm text-body sm:text-lg">
						The Chainsite may change these Terms due to changes in the Chainsite, the Chainsite&apos;s
						policies, the services and in the usual course of developing our product, changes in any
						relevant feature or functionality of the Chainsite, changes in circumstances beyond our
						reasonable control, to adapt to new technologies, and to address changes in law and regulatory
						requirements as well as security and fraud issues.
					</li>
				</ul>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">13.2 Indemnification</h3>
				<p className="text-sm text-body sm:text-lg">
					To the fullest extent possible under applicable law, you agree to defend, indemnify, and hold the
					Chainsite and Pakt harmless, including its officers, directors, or shareholders, employees,
					affiliates and agents, from and against any claims, damages, obligations, losses, liabilities,
					costs, debt and expenses (including attorneys’ fees) arising from: (1) your violation of any of
					these Terms or any other Pakt Terms, policies and standards; (2) your violation of any third-party
					right, including any intellectual property right, access rights, property, or privacy right; and/or
					(3) any other type of claim that your Profile, Jobs, Wallet, Messages, and/or other use of the
					Chainsite or Pakt services caused to a third party, provided that the Chainsite and Pakt act with
					reasonable professional diligence. The Chainsite and Pakt reserve the right to handle their joint or
					individual legal defence however they deem fit—even if you are indemnifying Pakt—in which case you
					agree to cooperate so they can execute their strategy.
				</p>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">13.3 Severability</h3>
				<p className="text-sm text-body sm:text-lg">
					If any part of the Terms is found to be unenforceable, that part will be limited to the minimum
					extent necessary so that the Terms will otherwise remain in full force and effect. The Chainsite
					and/or Pakt’s nonenforcement of any part of the Terms is not a waiver of its right to later enforce
					that or any other part of the Terms.
				</p>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">13.4 Entire Agreement</h3>
				<p className="text-sm text-body sm:text-lg">
					Our Terms constitute the entire agreement concerning the subject matter therein, and supersede any
					other agreement regarding the Chainsite or services.
				</p>
				{/*  */}
				<h3 className="text-base font-bold text-black sm:text-center sm:text-3xl">13.5 Interpretation</h3>
				<ul className="list-disc pl-8">
					<li className="text-sm text-body sm:text-lg">
						Any heading, caption or section title contained herein, and/or any explanation or summary
						columns, is provided only for convenience, and in no way alters and/or amend the provisions
						within the Terms nor shall it legally bind us in any way.
					</li>
					<li className="text-sm text-body sm:text-lg">
						The original language of the Terms is English. Pakt makes this translation available for
						convenience only. In case of conflicts between the original English version and any translation,
						the English version shall prevail.
					</li>
				</ul>
			</div>
		</>
	);
};
