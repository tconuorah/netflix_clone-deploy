output "public_ip" { value = aws_instance.this.public_ip }
output "instance_id" { value = aws_instance.this.id }
output "sg_id" { value = aws_security_group.this.id }
