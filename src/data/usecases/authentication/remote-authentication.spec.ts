import { RemoteAuthentication } from "./remote-authentication";
import { HttpPostClientSpy } from "@/data/test";
import { HttpStatusCode } from "@/data/protocols/http";
import { mockAccountModel, mockAuthentication } from "@/domain/test/mock-account";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/errors";
import { AuthenticationParams } from "@/domain/usecases";
import { AccountModel } from "@/domain/models";
import faker from "faker";

type SutTypes = {
    sut: RemoteAuthentication,
    httpPostClientSpy: HttpPostClientSpy<AuthenticationParams,AccountModel>
}

const makeSut = (url: string = faker.internet.url()):SutTypes =>{
    const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams,AccountModel>()
    const sut = new RemoteAuthentication(url,httpPostClientSpy)
    return{
        sut,
        httpPostClientSpy
    }
}

describe('RemoteAuthetication', () => {
    test('should call HttpPostClient with correct URL', async () => {
        const url = faker.internet.url()
        const{ sut, httpPostClientSpy} = makeSut(url)
        await sut.auth(mockAuthentication())
        expect (httpPostClientSpy.url).toBe(url)
    });

    test('should call HttpPostClient with correct body', async () => {
        const{ sut, httpPostClientSpy} = makeSut()
        const autheticationParams = mockAuthentication()
        await sut.auth(autheticationParams)
        expect (httpPostClientSpy.body).toEqual(autheticationParams)
    });

    test('should throw InvalidCredentialsError if HttpPostClient returns 401', async () => {
        const{ sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.unathorized
        }
        const autheticationParams = mockAuthentication()
        const promise = sut.auth(autheticationParams)
        await expect (promise).rejects.toThrow(new InvalidCredentialsError())
    });

    test('should throw UnexpectedError if HttpPostClient returns 400', async () => {
        const{ sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.badRequest
        }
        const autheticationParams = mockAuthentication()
        const promise = sut.auth(autheticationParams)
        await expect (promise).rejects.toThrow(new UnexpectedError())
    });

    test('should throw UnexpectedError if HttpPostClient returns 500', async () => {
        const{ sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.serverError
        }
        const autheticationParams = mockAuthentication()
        const promise = sut.auth(autheticationParams)
        await expect (promise).rejects.toThrow(new UnexpectedError())
    });

    test('should throw UnexpectedError if HttpPostClient returns 404', async () => {
        const{ sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.notFound
        }
        const autheticationParams = mockAuthentication()
        const promise = sut.auth(autheticationParams)
        await expect (promise).rejects.toThrow(new UnexpectedError())
    });
    
    test('should return an AccountModel if HttpPostClient returns 200', async () => {
        const{ sut, httpPostClientSpy} = makeSut()
        const httpResult = mockAccountModel()
        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.ok,
            body: httpResult
        }
        const account = await sut.auth(mockAuthentication())
        expect (account).toEqual(httpResult)
    });
});