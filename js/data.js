/**
 * 数据加载模块 - 提供品牌和车型数据的全局访问
 * 数据通过 <script> 标签从 data/brands.js 和 data/cars.js 加载
 */

/**
 * 获取所有品牌列表
 * @returns {Array}
 */
function getAllBrands() {
  return BRANDS_DATA;
}

/**
 * 根据品牌 ID 获取品牌信息
 * @param {string} brandId
 * @returns {object|undefined}
 */
function getBrandById(brandId) {
  return BRANDS_DATA.find(function (b) { return b.id === brandId; });
}

/**
 * 根据品牌 ID 获取该品牌所有车型
 * @param {string} brandId
 * @returns {Array}
 */
function getCarsByBrand(brandId) {
  return CARS_DATA.filter(function (c) { return c.brand_id === brandId; });
}

/**
 * 根据车型 ID 获取车型信息
 * @param {string} carId
 * @returns {object|undefined}
 */
function getCarById(carId) {
  return CARS_DATA.find(function (c) { return c.id === carId; });
}

/**
 * 获取某个品牌的所有车型数量
 * @param {string} brandId
 * @returns {number}
 */
function getCarCountByBrand(brandId) {
  return getCarsByBrand(brandId).length;
}
