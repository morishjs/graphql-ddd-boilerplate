import * as path from 'path';
import { Builder, fixturesIterator, IFixture, Loader, Parser, Resolver } from 'typeorm-plus-fixtures-cli';
import { Connection } from 'typeorm-plus';
import R from 'ramda';
import { ObjectLiteral } from '../../src/common/types';
import { exists } from '../../src/common/logics';
import { Container } from 'typedi';

interface FixturesAndBuilder {
  fixtures: IFixture[];
  builder: Builder;
}

interface Relation {
  propName: string;
  propValue: any;
}

export default class FixtureLoader {
  public static async loadFixtures(modelName: string): Promise<any[]> {
    try {
      const connection = Container.get<Connection>('connection');

      const { fixtures, builder } = this.loadFixturesAndBuilder(modelName);

      const entities = [];
      for (const fixture of fixturesIterator(fixtures)) {
        let entity = await builder.build(fixture);
        entity = await connection.getRepository(entity.constructor.name).save(entity, { reload: true });

        entities.push(entity);
      }

      return entities;
    } catch (err) {
      throw err;
    }
  }

  public static async loadFixture(
    modelName: string,
    options?: { relations?: Relation[]; props?: ObjectLiteral },
  ): Promise<any> {
    try {
      const connection = Container.get<Connection>('connection');

      const { fixtures, builder } = this.loadFixturesAndBuilder(modelName);

      let entity;
      const fixture = R.head(fixtures);
      entity = await builder.build(fixture);

      const relations = R.prop('relations', options);
      if (exists(relations)) {
        for (const relation of relations) {
          entity[relation.propName] = relation.propValue;
        }
      }

      const props = R.prop('props', options);
      if (exists(props)) {
        for (const key of R.keys(props)) {
          if (exists(props[key])) {
            entity[key] = props[key];
          }
        }
      }

      entity = await connection.getRepository(entity.constructor.name).save(entity, { reload: true });
      return entity;
    } catch (err) {
      throw err;
    }
  }

  private static loadFixturesAndBuilder(modelName: string): FixturesAndBuilder {
    try {
      const connection = Container.get<Connection>('connection');
      const loader = new Loader();
      loader.load(path.resolve(`test/fixtures/${modelName}.yml`));

      const resolver = new Resolver();
      const fixtures = resolver.resolve(loader.fixtureConfigs);
      const builder = new Builder(connection, new Parser());

      return { fixtures, builder };
    } catch (e) {
      throw e;
    }
  }
}
