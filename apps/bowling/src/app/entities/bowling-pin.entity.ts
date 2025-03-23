import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { AssetContainerService } from '../core/asset-container.service';
import { SceneService } from '../core/scene.service';
import { TransformNodeComponent } from '../components/transform-node.component';
import {
  type Mesh,
  PhysicsAggregate,
  PhysicsShapeContainer,
  PhysicsShapeConvexHull,
  Vector3,
} from '@babylonjs/core';

@injectable()
export class BowlingPinEntity {
  private readonly worldService = injectService(WorldService);
  private readonly assetContainerService = injectService(AssetContainerService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private async initialize() {
    const { transformNode } = await this.createTransformNodeComponent();
    this.worldService.getWorld<TransformNodeComponent>().add({ transformNode });
  }

  private async createTransformNodeComponent() {
    await this.assetContainerService.getAssetContainer('meshes/bowling.glb');

    const bowlingPin =
      this.sceneService.scene.getTransformNodeByName('Cylinder');
    if (bowlingPin) {
      bowlingPin.setEnabled(false);
      const scene = this.sceneService.scene;
      const shapeContainer = new PhysicsShapeContainer(scene);
      bowlingPin.getChildMeshes().forEach((mesh) => {
        const physicsShape = new PhysicsShapeConvexHull(mesh as Mesh, scene);

        shapeContainer.addChildFromParent(bowlingPin, physicsShape, mesh);
      });

      const pinPositions = [
        new Vector3(0, 0.15, -7.3),
        new Vector3(0.1, 0.15, -7.45),
        new Vector3(-0.1, 0.15, -7.45),
        new Vector3(0, 0.15, -7.6),
        new Vector3(0.2, 0.15, -7.6),
        new Vector3(-0.2, 0.15, -7.6),
        new Vector3(-0.3, 0.15, -7.75),
        new Vector3(-0.1, 0.15, -7.75),
        new Vector3(0.1, 0.15, -7.75),
        new Vector3(0.3, 0.15, -7.75),
      ];

      pinPositions.forEach((position, i) => {
        const instance = bowlingPin.instantiateHierarchy();
        if (instance) {
          instance.position.copyFrom(position);
          instance.name = `pin_${i}`;
          new PhysicsAggregate(
            instance,
            shapeContainer,
            { mass: 1, restitution: 0 },
            scene
          );
        }
      });
      return new TransformNodeComponent(bowlingPin);
    }

    throw Error('bowling asset not found');
  }
}
