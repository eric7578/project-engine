const entity = require('../repository/entity')

exports.makeCommit = async function (message, parentId) {
  if (parentId) {
    const parent = await entity.findById(parentId)
    if (!parent) {
      throw new Error('parent not exist')
    }

    return await entity.create(message, parentId)
  } else {
    return await entity.createRoot(message)
  }
}
