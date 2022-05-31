import { RemoteAuthentication } from "./remote-authentication";
import { HttpPostClientSpy } from "@/data/test/mock-http-client";
import { mockAuthentication } from "@/domain/test/mock-authentication";
import { InvalidCredentialsError } from "@/domain/errors/invalid-credentials-error";
import { HttpStatusCode } from "@/data/protocols/http/http-response";
import faker from "faker";

type SutTypes = {
    sut: RemoteAuthentication,
    httpPostClientSpy: HttpPostClientSpy
}

const makeSut = (url: string = faker.internet.url()):SutTypes =>{
    const httpPostClientSpy = new HttpPostClientSpy()
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

    test('should throw InvalidCredentialsError uf HttpPostClient returns 401', async () => {
        const{ sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.unathorized
        }
        const autheticationParams = mockAuthentication()
        const promise = sut.auth(autheticationParams)
        await expect (promise).rejects.toThrow(new InvalidCredentialsError())
    });
});