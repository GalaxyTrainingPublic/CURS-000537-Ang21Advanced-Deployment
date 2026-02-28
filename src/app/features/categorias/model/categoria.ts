
export type EstadoCategoria = 'ACTIVO' | 'INACTIVO';

export class Categoria {

  constructor(
    public nombreCorto: string,
    public nombreLargo: string,
    public id?: number,
    public estado: EstadoCategoria = 'ACTIVO'
  ) {}

  static fromApi(data: any): Categoria {
    return new Categoria(
      data.nombreCorto ?? '',
      data.nombreLargo ?? '',
      data.id,
      data.estado === 1 ? 'ACTIVO' : 'INACTIVO'
    );
  }

  toApi(): any {
    return {
      id: this.id,
      nombreCorto: this.nombreCorto,
      nombreLargo: this.nombreLargo,
      estado: this.estado === 'ACTIVO' ? 1 : 0
    };
  }

  esValida(): boolean {
    return this.nombreCorto.trim().length > 0 &&
           this.nombreLargo.trim().length > 0;
  }

  activar(): void {
    this.estado = 'ACTIVO';
  }

  desactivar(): void {
    this.estado = 'INACTIVO';
  }

  estaActiva(): boolean {
    return this.estado === 'ACTIVO';
  }

}
