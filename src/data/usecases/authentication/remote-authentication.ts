import { HttpPostClient } from "domain/protocols/http/http-post-client";

export class RemoteAuthentication{
    constructor (private readonly url:string, 
                 private readonly httpPostClient: HttpPostClient){}

    async auth(): Promise<void>{
        await this.httpPostClient.post(this.url)
    }
}