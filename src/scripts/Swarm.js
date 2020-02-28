import * as THREE from 'three';

export default class Swarm {
  constructor(bgScene) {
    this.bgScene = bgScene;
    this.count = 10000;
    this.dummy = new THREE.Object3D();

    const geo = new THREE.IcosahedronBufferGeometry(0.2);
    const mat = new THREE.MeshPhongMaterial({
      shininess: 44,
      color: 0xffffff
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, 1000);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    this.initParticles();

    this.bgScene.add(this.mesh);
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      //   this.randomizeMatrix(matrix, position, rotation, quaternion, scale);
      //   this.mesh.setMatrixAt(i, matrix);
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -20 + Math.random() * 40;
      const yFactor = -20 + Math.random() * 40;
      const zFactor = -20 + Math.random() * 40;
      this.particles.push({
        t,
        factor,
        speed,
        xFactor,
        yFactor,
        zFactor,
        mx: 0,
        my: 0
      });
    }
  }

  update(time) {
    if (!this.mesh) return;

    const r = 1;
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.max(1.5, Math.cos(t) * 5);
      //   particle.mx += (mouse.current[0] - particle.mx) * 0.02;
      //   particle.my += (-mouse.current[1] - particle.my) * 0.02;
      this.dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      this.dummy.scale.set(s, s, s);
      this.dummy.rotation.x += 0.000005 + speed * 0.05;
      this.dummy.rotation.z += 0.000005 + speed * 0.05;
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
