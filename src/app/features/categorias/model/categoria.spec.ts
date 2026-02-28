import { Categoria } from './categoria';

describe('Categoria Model Mapping', () => {
  it('debe mapear 1 como ACTIVO', () => {
    const categoria = Categoria.fromApi({
      nombreCorto: 'TEC',
      nombreLargo: 'Tecnología',
      estado: 1,
    });

    expect(categoria.estado).toBe('ACTIVO');
  });

  it('debe mapear 0 como INACTIVO', () => {
    const categoria = Categoria.fromApi({
      nombreCorto: 'TEC',
      nombreLargo: 'Tecnología',
      estado: 0,
    });

    expect(categoria.estado).toBe('INACTIVO');
  });

  it('debe convertir ACTIVO a 1 para API', () => {
    const categoria = new Categoria('TEC', 'Tecnología');
    const api = categoria.toApi();

    expect(api.estado).toBe(1);
  });

  it('debe convertir INACTIVO a 0 para API', () => {
    const categoria = new Categoria('TEC', 'Tecnología');
    categoria.desactivar();

    const api = categoria.toApi();

    expect(api.estado).toBe(0);
  });

  it('debe usar valores vacíos si vienen null en fromApi', () => {
    const categoria = Categoria.fromApi({
      nombreCorto: null,
      nombreLargo: null,
      estado: 1,
    });

    expect(categoria.nombreCorto).toBe('');
    expect(categoria.nombreLargo).toBe('');
  });

  it('debe mapear id desde API', () => {
    const categoria = Categoria.fromApi({
      id: 10,
      nombreCorto: 'TEC',
      nombreLargo: 'Tecnología',
      estado: 1,
    });

    expect(categoria.id).toBe(10);
  });

  it('debe ser inválida si nombreLargo está vacío', () => {
    const categoria = new Categoria('TEC', '');
    expect(categoria.esValida()).toBeFalse();
  });

  it('debe ser inválida si solo contiene espacios', () => {
    const categoria = new Categoria('   ', '   ');
    expect(categoria.esValida()).toBeFalse();
  });

  it('debe activar la categoría', () => {
    const categoria = new Categoria('TEC', 'Tecnología');
    categoria.desactivar();
    categoria.activar();

    expect(categoria.estado).toBe('ACTIVO');
  });

  it('debe activar la categoría', () => {
    const categoria = new Categoria('TEC', 'Tecnología');
    categoria.desactivar();
    categoria.activar();

    expect(categoria.estado).toBe('ACTIVO');
  });

  it('estaActiva debe retornar true si está ACTIVO', () => {
    const categoria = new Categoria('TEC', 'Tecnología');
    expect(categoria.estaActiva()).toBeTrue();
  });

  it('estaActiva debe retornar false si está INACTIVO', () => {
    const categoria = new Categoria('TEC', 'Tecnología');
    categoria.desactivar();

    expect(categoria.estaActiva()).toBeFalse();
  });
});
