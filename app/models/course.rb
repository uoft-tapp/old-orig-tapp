class Course < ApplicationRecord
  belongs_to :campus
  belongs_to :instructor
  has_many :positions
end
