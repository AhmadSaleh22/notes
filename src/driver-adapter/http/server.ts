import express from 'express'
import http from 'http'

type GetExpressOpenApiServer = ({
  app,
  port
}: {
  app: express.Express
  port: number
}) => http.Server

const getExpressOpenApiServer: GetExpressOpenApiServer = ({ app, port }) => {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })

  return server
}

export { getExpressOpenApiServer }
