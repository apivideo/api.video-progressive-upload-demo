import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          {/*
            Inter: Regular, Medium, Bold, Black
            https://fonts.google.com/share?selection.family=Inter:wght@400;500;700;900
          */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
            rel="stylesheet"
          />
          <link
            rel="icon"
            sizes="16x16"
            href="https://api-video.imgix.net/1631544061-favicon-32x32.png?w=16&amp;h=16"
            type="image/png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
