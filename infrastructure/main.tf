terraform {
  backend "s3" {
    bucket = "infrastructure-remote-state"
    key    = "reactremote/collector.tfstate"
    region = "eu-central-1"
  }
}

resource "aws_dynamodb_table" "features" {
  name           = "reactremote_jobs"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = "true"
  }
}