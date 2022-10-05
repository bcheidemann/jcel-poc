import { Sheet } from '../src/sheet';

describe('poc', () => {
  it('Should perform basic updates', async () => {
    const sheet = new Sheet();

    sheet.createCell('0/0');
    sheet.createCell('0/1');

    await sheet.setCellValue('0/0', 1);
    await sheet.setCellFormula('0/1', 'return cell[0][0] * 2;');

    expect(sheet.getCell('0/0')!.value).toBe(1);
    expect(sheet.getCell('0/1')!.value).toBe(2);

    await sheet.setCellValue('0/0', 2);

    expect(sheet.getCell('0/0')!.value).toBe(2);
    expect(sheet.getCell('0/1')!.value).toBe(4);
  });

  it('Should work with branches', async () => {
    const sheet = new Sheet();

    sheet.createCell('0/0');
    sheet.createCell('0/1');
    sheet.createCell('0/2');

    await sheet.setCellValue('0/0', 1);
    await sheet.setCellFormula('0/1', 'return cell[0][0] * 2;');
    await sheet.setCellFormula('0/2', 'return cell[0][0] + cell[0][1];');

    expect(sheet.getCell('0/0')!.value).toBe(1);
    expect(sheet.getCell('0/1')!.value).toBe(2);
    expect(sheet.getCell('0/2')!.value).toBe(3);

    await sheet.setCellValue('0/0', 2);

    expect(sheet.getCell('0/0')!.value).toBe(2);
    expect(sheet.getCell('0/1')!.value).toBe(4);
    expect(sheet.getCell('0/2')!.value).toBe(6);

    await sheet.setCellFormula('0/1', 'return cell[0][0] + 10;');

    expect(sheet.getCell('0/0')!.value).toBe(2);
    expect(sheet.getCell('0/1')!.value).toBe(12);
    expect(sheet.getCell('0/2')!.value).toBe(14);
  });

  it('Should allow a cell to set the value of another cell', async () => {
    const sheet = new Sheet();

    sheet.createCell('0/0');
    sheet.createCell('0/1');
    sheet.createCell('0/2');

    await sheet.setCellValue('0/0', 3);
    await sheet.setCellValue('0/1', 4);
    await sheet.setCellFormula('0/2', `
      const distance = ((cell[0][0] ** 2) + (cell[0][1] ** 2)) ** 0.5;

      cell[1][0] = distance + "km";
      cell[1][1] = distance * 1000 + "m";

      return distance;
    `);

    expect(sheet.getCell('0/0')!.value).toBe(3);
    expect(sheet.getCell('0/1')!.value).toBe(4);
    expect(sheet.getCell('0/2')!.value).toBe(5);

    expect(sheet.getCell('1/0')!.value).toBe('5km');
    expect(sheet.getCell('1/1')!.value).toBe('5000m');

    await sheet.setCellValue('0/0', 13);
    await sheet.setCellValue('0/1', 84);

    expect(sheet.getCell('0/0')!.value).toBe(13);
    expect(sheet.getCell('0/1')!.value).toBe(84);
    expect(sheet.getCell('0/2')!.value).toBe(85);

    expect(sheet.getCell('1/0')!.value).toBe('85km');
    expect(sheet.getCell('1/1')!.value).toBe('85000m');
  });
});
