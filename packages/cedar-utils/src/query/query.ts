export function fsToArr(fs: any) {
  if (fs.features) {
    return fs.features.map((attr) => attr.attributes)
  }
}

const query = {
  fsToArr
}

export default query
