class Campus < ApplicationRecord
  has_many :courses
  validates :code, uniqueness: true
end
