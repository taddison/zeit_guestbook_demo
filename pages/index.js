import { useEffect } from 'react'
import cookie, { serialize } from 'cookie'
import Head from 'next/head'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import { createSession } from "../graphql/api";

let nextSessionId = 1;

const Guestbook = props => {
  useEffect(() => {
    // not for prod!
    Pusher.logToConsole = true;

    var pusher = new Pusher('aa197f335188c94d919f', {
      cluster: 'us2',
      forceTLS: true
    });

    var channel = pusher.subscribe('my-channel');
    channel.bind('my-event', function(data) {
      alert(JSON.stringify(data));
    });
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/static/favicon.png"
        />
        <script src="https://js.pusher.com/5.1/pusher.min.js"></script>
      </Head>
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
        }
      `}</style>
      <div>
        <Hero />
        <div>
          SessionId: {props.sessionId}
        </div>
        <Footer />
      </div>
      <style jsx>{`
        div {
          display: flex;
          margin-left: auto;
          margin-right: auto;
          font-family: sans-serif, sans;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </>
  )
}

const SESSION_COOKIE_NAME = 'zgd_sid';

Guestbook.getInitialProps = async ctx => {
  if (typeof window === 'undefined') {
    const { req, res } = ctx;
    const cookies = cookie.parse(req.headers.cookie ?? '');
    
    let sessionId = cookies[SESSION_COOKIE_NAME];
    if(!sessionId) {
      // If not set, assign the next sessionId
      sessionId = nextSessionId++;
      // await createSession(sessionId);
      res.setHeader('Set-Cookie', serialize(SESSION_COOKIE_NAME, sessionId));
    } else {
      // Otherwise delete it
      res.setHeader('Set-Cookie', serialize(SESSION_COOKIE_NAME, '', { expires: new Date(0)}));
      sessionId = "session deleted"
    }
    
    return {
      sessionId
    }
  }
}

export default Guestbook
