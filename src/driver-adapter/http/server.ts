import express from 'express'
import http from 'http'

type GetExpressServer = ({
  app,
  port
}: {
  app: express.Express
  port: number
}) => http.Server

const getExpressServer: GetExpressServer = ({ app, port }) => {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })

  return server
}

export { getExpressServer }
