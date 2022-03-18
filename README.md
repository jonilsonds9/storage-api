<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Descrição

Este é um projeto de um API de armezenamento (Storage API) feito usando o 
[Nest](https://github.com/nestjs/nest) que é um framework TypeScript.

## Instalação

```bash
$ npm install
```

## Executando a aplicação

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Requisições

### Home
Formato da requisição:
```shell
curl --request GET \
--url http://localhost:3000/
```
Reposta:
```json
{"message": "Storage API"}
```

### Upload
Formato da requisição:

```shell
curl --request PUT \
  --url http://localhost:3000/imagens/imagem-teste.png \
  --header 'AccessKey: <access_key>' \
  --header 'Content-Type: multipart/form-data;' \
  --form data=@/home/jonilson/Pictures/mergulhador.png
```
Reposta:
```json
{"HttpCode":201,"Message":"File uploaded."}
```


### Download

Formato da request:
```shell
curl --request GET \
  --url http://localhost:3000/imagens/imagem-teste.png \
  --header 'AccessKey: <access_key>'
```
Resposta de sucesso: O arquivo.

Resposta de erro:
```json
{
  "statusCode": 404,
  "message": "Not Found"
}
```

### Delete
Formato da request:
```shell
curl --request DELETE \
  --url http://localhost:3000/imagens/imagem-teste.png \
  --header 'AccessKey: <access_key>'
```

Resposta de sucesso:
```json
{
"HttpCode": 200,
"Message": "Object was successfully deleted"
}
```

Resposta de erro:
```json
{
"statusCode": 404,
"message": "Not Found"
}
```