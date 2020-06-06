import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm-plus';

export const iocLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  routingUseContainer(Container);
  ormUseContainer(Container);
};
