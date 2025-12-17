variable "name" { type = string }
variable "vpc_id" { type = string }
variable "subnet_id" { type = string }
variable "key_name" { type = string }
variable "admin_cidrs" { type = list(string) }
variable "tags" { type = map(string) }

variable "instance_type" {
  type    = string
  default = "t3.medium"
}

variable "user_data" {
  type    = string
  default = ""
}

variable "iam_instance_profile" {
  type    = string
  default = null
}
