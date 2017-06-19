class Teach < ApplicationRecord
  has_many :positions
  has_many :instructors
end
