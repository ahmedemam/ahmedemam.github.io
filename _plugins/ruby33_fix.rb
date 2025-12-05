# Fix for Jekyll 4.2.2 compatibility with Ruby 3.3
# This patches the logger level_override issue

if RUBY_VERSION >= "3.3.0"
  require 'logger'
  
  class Logger
    alias_method :original_level, :level
    
    def level
      @level_override ||= {}
      original_level
    end
  end
end

