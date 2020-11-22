import React from "react";

import './about.css'

export default class About extends React.Component {
  render(){
    return (
      <div className="about">
      <section class="header">
        <h1>BubbleUp</h1>
        <h3>The app to help you navigate safe social gathering during
          the pandemic.</h3>
      </section>
      <a class="emailBanner" href="#signup">
        <p>
        We're preparing for beta launch in early December – <u>make sure you're on the list</u> to be
        notified when we open sign-ups!
        </p>
      </a>
      <section>
        <div class="flex">
          <img alt="vector illustration of a girl" src="https://firebasestorage.googleapis.com/v0/b/bubbleup-ecae7.appspot.com/o/girl1.png?alt=media&token=516f9e04-07fb-4a13-9a99-f0908a774612" class="singleBubble"/>
          <span>
            <h3>Are you part of a Covid-19 social bubble?</h3>
            <p>One of the most commonly recommended ways to socialize during the pandemic while minimizing risk
              is by creating a "bubble".
              Eventually, however, people in the bubble <i>will</i>
              leave the bubble. <b>Work, doctor's appointments, childcare arrangements,
              family trips, and other exceptions are inevitable.</b> But keeping your
              bubble up to date with everyone's activity is hard when communication
              is spread across phone calls, texts, or long email threads.
              <br/><br/>
              <b>If only there was a hub where you could
              gather and manage all the information your bubble needs to operate safely...</b>
            </p>
          </span>
        </div>
      </section>
       <section class="blueBG flex">
         <span>
        <h3>Meet BubbleUp: simple, social, safe.</h3>
        <p>Create a bubble, add your friends, establish your bubble's guidelines,
          and use our super-quick check-in to share recent activity information. Next time
          you want to meet up, BubbleUp to see:</p>
        <ul>
          <li>the last time people in your bubble socialized outside the bubble</li>
          <li>if they were indoors, wearing a mask, or socially distant during that meeting</li>
          <li>if they used public transport</li>
          <li>their recent COVID-19 test dates and results</li>
          <li>and more, based on what your bubble members self-report!</li>
        </ul>
        <p>Rather than pretending these exceptions will never happen,
        <b>BubbleUp helps you include these variables as a realistic
        part of your planning.</b> Doctor's offices and other professional
        settings now use similar self-report check-ins regularly, but there hasn't been an easy way to do the same with your bubble – until now!</p>
      </span>

      <img alt="vector illustration of a boy" src="https://firebasestorage.googleapis.com/v0/b/bubbleup-ecae7.appspot.com/o/boy1.png?alt=media&token=4b717fe1-06e9-4544-ae03-e936c6ef9730" class="singleBubble"/>
      </section>
      <section class="flex privacy">
        <img alt="vector illustration of a group of people" src="https://firebasestorage.googleapis.com/v0/b/bubbleup-ecae7.appspot.com/o/group.png?alt=media&token=b55c8ae9-7319-4e4f-936a-df6a8774c02a" class="group"/>
        <span>
          <h3  >Your activity is <i>only</i> visible to the people in your bubble.</h3>
          <p> We will <b>never</b> track or ask your location, <b>never</b> gather any data using background
          services, and <b>never</b> sell any data.
          All activity information is self-reported
          by you, and <b>never</b> shared
          outside your bubble. Every check-in question is optional, and the only "personal"
          information we require is an email address & username. You can always share confidently within
          your bubble.</p>
        </span>
      </section>
      <section class="callout" id="signup">
        <h3>We're still in development – sign up, and you'll be the first to know when we launch!</h3>
        <div id="mc_embed_signup" >
          <form action="https://gmail.us2.list-manage.com/subscribe/post?u=512d37f666a7b79860da0ffea&amp;id=b91ff307b9" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
              <div class="emailFlex" id="mc_embed_signup_scroll">
          	     <input
                  type="email"
                  name="EMAIL"
                  class="email"
                  id="mce-EMAIL"
                  placeholder="email address"
                  required />
                 <div
                  style={{position: 'absolute', left: '-5000px'}}
                  aria-hidden="true"
                  >
                <input
                  type="text"
                  name="b_512d37f666a7b79860da0ffea_b91ff307b9"
                  tabindex="-1"
                  value="" />
                </div>
              <div class="clear">
                <input
                  type="submit"
                  value="Subscribe"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  class="button" />
              </div>
            </div>
          </form>
        </div>

        <p>We'd love to hear from you! <a href="https://docs.google.com/forms/d/e/1FAIpQLSeieENqBZ2mwm6-vZkbPQBloCnKmnd-WRstChePBxNX_o9LEg/viewform?usp=sf_link">Take our quick survey</a> to help us
          decide which features to prioritize. Thank you, and stay safe!</p>

          <p style={{fontSize: '10px', textAlign: 'center', margin: '10px 0 0 5px'}}>
            Copyright © BubbleUp 2020 All Rights Reserved
          </p>
      </section>
      </div>
    )
  }
}
