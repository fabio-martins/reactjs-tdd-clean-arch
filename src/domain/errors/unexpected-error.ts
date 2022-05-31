export class UnexpectedError extends Error{
    constructor(){
        super('Um erro ocorreu, por favor tente novamente mais tarde')
        this.name = 'UnexpectedError'
    }
}