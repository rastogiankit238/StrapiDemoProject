import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='bg-gradient-to-r from-orange-400 via-white to-green-400'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
