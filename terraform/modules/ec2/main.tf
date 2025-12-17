data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_security_group" "this" {
  name   = "${var.name}-sg"
  vpc_id = var.vpc_id

  ingress {
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = var.admin_cidrs
}

ingress {
  from_port   = 8080
  to_port     = 8080
  protocol    = "tcp"
  cidr_blocks = var.admin_cidrs
}

ingress {
  from_port   = 9000
  to_port     = 9000
  protocol    = "tcp"
  cidr_blocks = var.admin_cidrs
}

egress {
  from_port   = 0
  to_port     = 0
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}

}

resource "aws_instance" "this" {
  ami                         = data.aws_ami.al2023.id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [aws_security_group.this.id]
  key_name                    = var.key_name
  associate_public_ip_address = true
  user_data                   = var.user_data
  iam_instance_profile        = var.iam_instance_profile

  tags = merge(var.tags, { Name = var.name })


}
