export interface Tree {
  id: number
  label: string
  parentId?: string
  children?: Tree[]
}