import { Body, Controller, Post, Route, Security } from "tsoa";
import DataSource from "../db/DataSource";
import { Dealer } from "../db/entity";

interface DealerInputBody {
  name: string
}

@Route("dealers")
@Security("auth0", ["dealer-service:read"])
export class DealerController extends Controller {
  @Post()
  public async createUser(@Body() requestBody: DealerInputBody): Promise<Dealer> {
    const repository = DataSource.getRepository(Dealer)
    const dealer = repository.create({ name: 'dealer 1' })
    const persistedDealer = await repository.save(dealer)

    return persistedDealer
  }
}

export default DealerController
